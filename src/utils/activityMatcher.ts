import { QuizAnswers } from '../store/quizStore';
import { Activity } from '../types/activity';

// Fonction pour normaliser les noms de pays (supprimer les accents, mettre en minuscule)
function normalizeCountryName(country: string | undefined): string {
  if (!country) return '';
  return country.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchActivitiesWithAnswers(allActivities: Activity[], answers: QuizAnswers): Activity[] {
  // Vérifier que les activités sont un tableau valide
  if (!Array.isArray(allActivities)) {
    console.warn('Les activités ne sont pas un tableau valide');
    return [];
  }

  // Si pas de réponses, retourner toutes les activités
  if (!answers || Object.keys(answers).length === 0) {
    return allActivities;
  }

  // Filtrer d'abord par pays si spécifié (ID 0 réservé pour le pays)
  let filteredActivities = allActivities;
  if (answers[0]) {
    const selectedCountry = answers[0];
    filteredActivities = allActivities.filter(activity => {
      if (!activity || !activity.country) return false;
      return normalizeCountryName(activity.country) === normalizeCountryName(selectedCountry);
    });
  }

  // Filtrer ensuite par ville si spécifiée (ID 1 réservé pour la ville)
  if (answers[1]) {
    const selectedCity = answers[1];
    filteredActivities = filteredActivities.filter(activity => {
      if (!activity || !activity.city) return false;
      return activity.city.toLowerCase() === selectedCity.toLowerCase();
    });
  }

  // Déterminer si c'est un quiz alimentaire
  const isFoodQuiz = Object.keys(answers).some(key => parseInt(key) >= 101);

  // Système de scoring pour les activités
  const scoredActivities = filteredActivities.map(activity => {
    if (!activity) return { activity, score: 0 };
    
    let score = 0;
    let matches = 0;

    // Ville (Question 1) - déjà filtrée, mais on ajoute un bonus de score
    if (answers[1] && activity.city) {
      matches++;
      if (activity.city.toLowerCase() === answers[1].toLowerCase()) {
        score += 15;
      }
    }

    // Budget (Question 4 ou 102)
    const budgetQuestion = isFoodQuiz ? 102 : 4;
    if (answers[budgetQuestion] && activity.price) {
      matches++;
      const priceStr = activity.price.toLowerCase();
      if (priceStr === 'gratuit') {
        score += answers[budgetQuestion] === 'Gratuit' ? 15 : 0;
      } else {
        const price = parseFloat(priceStr.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
        
        // Adapter les plages de prix selon le type de quiz
        if (isFoodQuiz) {
          switch (answers[budgetQuestion]) {
            case "< 15€":
              score += price < 15 ? 15 : (price < 20 ? 5 : 0);
              break;
            case "15-30€":
              score += (price >= 15 && price <= 30) ? 15 : (price < 35 ? 5 : 0);
              break;
            case "30-50€":
              score += (price >= 30 && price <= 50) ? 15 : (price > 25 ? 5 : 0);
              break;
            case "50€+":
              score += price > 50 ? 15 : (price > 40 ? 5 : 0);
              break;
          }
        } else {
          switch (answers[budgetQuestion]) {
            case "Gratuit":
              score += price === 0 ? 15 : (price < 10 ? 5 : 0);
              break;
            case "< 25€":
              score += price < 25 ? 15 : (price < 30 ? 5 : 0);
              break;
            case "25-50€":
              score += (price >= 25 && price <= 50) ? 15 : (price < 60 ? 5 : 0);
              break;
            case "50-100€":
              score += (price >= 50 && price <= 100) ? 15 : (price > 40 ? 5 : 0);
              break;
            case "Peu importe":
              score += 15;
              break;
          }
        }
      }
    }

    // Type d'activité (Question 4)
    if (answers[4]) {
      matches++;
      const type = answers[4].toLowerCase();
      // Vérifier que les tags existent et sont un tableau
      if (Array.isArray(activity.tags) && activity.tags.some(tag => tag && tag.toLowerCase().includes(type))) {
        score += 15;
      } else if (activity.description && activity.description.toLowerCase().includes(type)) {
        score += 10;
      }
    }

    // Préférences spécifiques (Question 6)
    if (answers[6]) {
      matches++;
      const preferences = answers[6].split(', ');
      preferences.forEach(pref => {
        // Vérifier que les tags existent et sont un tableau
        if (Array.isArray(activity.tags) && activity.tags.some(tag => tag && tag.toLowerCase().includes(pref.toLowerCase()))) {
          score += 10;
        }
      });
    }

    // Préférences alimentaires (Questions 101-106 pour le food quiz)
    if (isFoodQuiz) {
      // Type de cuisine (Question 101)
      if (answers[101]) {
        matches++;
        const cuisine = answers[101].toLowerCase();
        // Vérifier que les tags existent et sont un tableau
        if (Array.isArray(activity.tags) && activity.tags.some(tag => tag && tag.toLowerCase().includes(cuisine))) {
          score += 20;
        } else if (activity.description && activity.description.toLowerCase().includes(cuisine)) {
          score += 10;
        }
      }

      // Ambiance (Question 103)
      if (answers[103]) {
        matches++;
        const ambiance = answers[103].toLowerCase();
        // Vérifier que les tags existent et sont un tableau
        if (Array.isArray(activity.tags) && activity.tags.some(tag => tag && tag.toLowerCase().includes(ambiance))) {
          score += 15;
        } else if (activity.description && activity.description.toLowerCase().includes(ambiance)) {
          score += 8;
        }
      }

      // Moment du repas (Question 104)
      if (answers[104]) {
        matches++;
        const mealTime = answers[104].toLowerCase();
        // Vérifier que les tags existent et sont un tableau
        if (Array.isArray(activity.tags) && activity.tags.some(tag => tag && tag.toLowerCase().includes(mealTime))) {
          score += 10;
        }
      }

      // Restrictions alimentaires (Question 105)
      if (answers[105] && answers[105] !== 'Aucune') {
        matches++;
        const dietary = answers[105].toLowerCase();
        // Vérifier que les tags existent et sont un tableau
        if (Array.isArray(activity.tags) && activity.tags.some(tag => tag && tag.toLowerCase().includes(dietary))) {
          score += 15;
        } else if (activity.description && activity.description.toLowerCase().includes(dietary)) {
          score += 8;
        }
      }

      // Sucré ou salé (Question 106)
      if (answers[106]) {
        matches++;
        const taste = answers[106].toLowerCase();
        // Vérifier que les tags existent et sont un tableau
        const isSweetActivity = Array.isArray(activity.tags) && activity.tags.some(tag => 
          tag && ['sucré', 'dessert', 'pâtisserie', 'glace', 'crêpe'].some(sweet => tag.toLowerCase().includes(sweet))
        );
        
        if ((taste.includes('sucré') && isSweetActivity) || 
            (taste.includes('salé') && !isSweetActivity) || 
            taste.includes('les deux')) {
          score += 10;
        }
      }

      // Vérifier si l'activité est un restaurant pour le food quiz
      // Vérifier que les tags existent et sont un tableau
      const isRestaurant = Array.isArray(activity.tags) && activity.tags.some(tag => 
        tag && ['restaurant', 'gastronomie', 'cuisine', 'food', 'repas', 'café', 'bistro'].includes(tag.toLowerCase())
      );
      
      if (isRestaurant) {
        score += 25; // Bonus important pour les restaurants dans le food quiz
      } else {
        score -= 15; // Pénalité pour les non-restaurants dans le food quiz
      }
    } else {
      // Pour le quiz régulier, pénaliser les restaurants
      // Vérifier que les tags existent et sont un tableau
      const isRestaurant = Array.isArray(activity.tags) && activity.tags.some(tag => 
        tag && ['restaurant', 'gastronomie', 'cuisine'].includes(tag.toLowerCase())
      );
      
      if (isRestaurant && answers[6] && !answers[6].toLowerCase().includes('gastronomie')) {
        score -= 10; // Pénalité pour les restaurants dans le quiz régulier sauf si préférence gastronomique
      }
    }

    return { activity, score: matches > 0 ? score : 50 };
  });

  // Trier par score et prendre toutes les activités
  return scoredActivities
    .sort((a, b) => b.score - a.score)
    .map(item => item.activity);
}