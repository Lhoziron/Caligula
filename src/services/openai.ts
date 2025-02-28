import OpenAI from 'openai';
import { QuizAnswers } from '../store/quizStore';
import { Activity } from '../types/activity';

let openai: OpenAI | null = null;

try {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (apiKey && apiKey.startsWith('sk-')) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  } else {
    console.warn('Clé API OpenAI invalide ou manquante');
  }
} catch (error) {
  console.warn('OpenAI initialization failed:', error);
}

function formatUserPreferences(answers: QuizAnswers): string {
  const mapping = {
    1: 'Ville',
    2: 'Âge',
    3: 'Groupe',
    4: 'Budget',
    5: 'Durée préférée',
    6: "Type d'activité",
    7: 'Environnement',
    8: 'Niveau activité',
    9: "Centre d'intérêt",
    10: 'Ambiance'
  };

  return Object.entries(answers)
    .map(([key, value]) => `${mapping[key as keyof typeof mapping]}: ${value}`)
    .join('\n');
}

export async function getAIRecommendations(answers: QuizAnswers, cityActivities: Activity[]): Promise<Activity[]> {
  // Si pas assez d'activités dans la ville, retourner toutes les activités
  if (cityActivities.length <= 3) {
    return cityActivities;
  }

  // Essayer d'abord les recommandations AI
  try {
    if (openai) {
      const userPreferences = formatUserPreferences(answers);
      const activitiesContext = cityActivities.map(a => 
        `ID: ${a.id}
        Titre: ${a.title}
        Description: ${a.description}
        Prix: ${a.price}
        Durée: ${a.duration}
        Tags: ${a.tags.join(', ')}
        ---`
      ).join('\n');

      const prompt = `En tant qu'expert en recommandations d'activités touristiques, analyse ces préférences utilisateur:

${userPreferences}

Voici les activités disponibles:

${activitiesContext}

En te basant sur:
1. La correspondance entre les préférences et les activités
2. L'âge et le type de groupe
3. Le budget et la durée disponible
4. Les centres d'intérêt et l'ambiance recherchée

Retourne UNIQUEMENT les IDs des 3 activités les plus pertinentes sous ce format exact: ID1,ID2,ID3
Ne fournis aucune explication, uniquement les IDs.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en recommandations d'activités touristiques. Tu dois analyser les préférences des utilisateurs et recommander les activités les plus pertinentes en te basant sur de multiples critères comme l'âge, le budget, les centres d'intérêt, etc."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 50
      });

      const recommendedIds = response.choices[0].message.content
        ?.split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

      if (recommendedIds && recommendedIds.length > 0) {
        const recommendations = cityActivities.filter(activity => 
          recommendedIds.includes(activity.id)
        );

        // Si on a au moins 2 recommandations, les retourner
        if (recommendations.length >= 2) {
          return recommendations;
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la recommandation AI:', error);
  }

  // Si l'AI échoue ou ne donne pas assez de résultats, utiliser le système local
  return getLocalRecommendations(answers, cityActivities);
}

function getLocalRecommendations(answers: QuizAnswers, activities: Activity[]): Activity[] {
  // Trier les activités par score
  const scoredActivities = activities.map(activity => {
    let score = 0;
    let maxScore = 0;

    // Budget
    if (answers[4]) {
      maxScore += 3;
      const price = activity.price === "Gratuit" ? 0 : parseFloat(activity.price.replace('€', '').trim()) || 0;
      
      switch (answers[4]) {
        case "Gratuit":
          score += price === 0 ? 3 : (price < 10 ? 1 : 0);
          break;
        case "< 20€":
          score += price < 20 ? 3 : (price < 25 ? 1 : 0);
          break;
        case "20-50€":
          score += (price >= 20 && price <= 50) ? 3 : (price < 60 ? 1 : 0);
          break;
        case "50-100€":
          score += (price >= 50 && price <= 100) ? 3 : (price > 40 ? 1 : 0);
          break;
        case "100€+":
          score += price > 100 ? 3 : (price > 80 ? 1 : 0);
          break;
      }
    }

    // Type d'activité
    if (answers[6]) {
      maxScore += 3;
      const activityType = answers[6].toLowerCase();
      if (activity.tags.some(tag => tag.toLowerCase().includes(activityType))) {
        score += 3;
      } else if (activity.description.toLowerCase().includes(activityType)) {
        score += 2;
      }
    }

    // Intérieur/Extérieur
    if (answers[7]) {
      maxScore += 2;
      const location = answers[7].toLowerCase();
      if (location === "les deux") {
        score += 2;
      } else if (activity.tags.includes(location === "intérieur" ? "intérieur" : "extérieur")) {
        score += 2;
      }
    }

    // Durée
    if (answers[5]) {
      maxScore += 2;
      const durationMatch = activity.duration.match(/(\d+)h?(\d*)/);
      let durationHours = 0;
      
      if (durationMatch) {
        durationHours = parseInt(durationMatch[1]);
        if (durationMatch[2]) {
          durationHours += parseInt(durationMatch[2]) / 60;
        }
      }
      
      switch (answers[5]) {
        case "1-2 heures":
          score += (durationHours >= 1 && durationHours <= 2) ? 2 : 1;
          break;
        case "Demi-journée":
          score += (durationHours > 2 && durationHours <= 4) ? 2 : 1;
          break;
        case "Journée entière":
          score += durationHours > 4 ? 2 : 0;
          break;
        case "Flexible":
          score += 2;
          break;
      }
    }

    // Centres d'intérêt et ambiance
    if (answers[9] || answers[10]) {
      maxScore += 4;
      const interests = [answers[9], answers[10]].filter(Boolean).map(i => i.toLowerCase());
      
      for (const interest of interests) {
        if (activity.tags.some(tag => tag.toLowerCase().includes(interest))) {
          score += 2;
        } else if (activity.description.toLowerCase().includes(interest)) {
          score += 1;
        }
      }
    }

    // Âge et groupe
    if (answers[2] && answers[3]) {
      maxScore += 2;
      const age = answers[2];
      const group = answers[3];

      if ((age === "18-25 ans" && activity.tags.some(t => t.includes("fun") || t.includes("aventure"))) ||
          (age === "60+ ans" && activity.tags.some(t => t.includes("calme") || t.includes("culture"))) ||
          (group === "En famille" && activity.tags.includes("famille")) ||
          (group === "En couple" && activity.tags.includes("romantique"))) {
        score += 2;
      }
    }

    const finalScore = maxScore > 0 ? (score / maxScore) * 100 : 50;
    return { activity, score: finalScore };
  });

  // Trier par score et prendre les 3 meilleures activités
  const sortedActivities = scoredActivities
    .sort((a, b) => b.score - a.score)
    .map(item => item.activity);

  // Retourner au moins 2 activités, même si les scores sont bas
  return sortedActivities.slice(0, Math.max(3, Math.min(2, sortedActivities.length)));
}
