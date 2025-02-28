// Utilitaire pour corriger les activités dupliquées
import { activities } from '../data/activities';

// Fonction pour obtenir une liste d'activités sans doublons
export function getUniqueActivities() {
  const uniqueActivities = [];
  const seenIds = new Set();
  
  activities.forEach(activity => {
    if (!seenIds.has(activity.id)) {
      seenIds.add(activity.id);
      uniqueActivities.push(activity);
    }
  });
  
  return uniqueActivities;
}

// Fonction pour corriger les activités avec l'ID 3001
export function fixActivity3001() {
  // Trouver toutes les activités avec l'ID 3001
  const activities3001 = activities.filter(activity => activity.id === 3001);
  
  if (activities3001.length <= 1) {
    return {
      fixed: false,
      message: "Pas de correction nécessaire, il n'y a pas de doublon pour l'ID 3001"
    };
  }
  
  // Créer des copies avec des IDs uniques pour les doublons
  const fixedActivities = activities.map((activity, index) => {
    if (activity.id === 3001 && index > activities.findIndex(a => a.id === 3001)) {
      // Créer un nouvel ID pour les doublons (3001 + index pour garantir l'unicité)
      return {
        ...activity,
        id: 3001 + (index * 1000) // Utiliser un grand écart pour éviter les collisions
      };
    }
    return activity;
  });
  
  return {
    fixed: true,
    originalCount: activities3001.length,
    fixedActivities,
    message: `Corrigé ${activities3001.length - 1} doublon(s) pour l'ID 3001`
  };
}

// Fonction pour vérifier si une activité est un restaurant
export function isRestaurantActivity(activity) {
  // Vérifier si les tags contiennent des mots-clés liés à la nourriture
  const foodTags = ['restaurant', 'gastronomie', 'cuisine', 'food', 'repas', 'déjeuner', 'dîner'];
  return activity.tags.some(tag => foodTags.some(foodTag => tag.toLowerCase().includes(foodTag)));
}