// Utilitaire pour vérifier les propriétés d'une activité spécifique
import { activities } from '../data/activities';

// Fonction pour trouver une activité par ID
export function findActivityById(id) {
  return activities.find(activity => activity.id === id);
}

// Fonction pour afficher toutes les propriétés d'une activité
export function logActivityProperties(id) {
  const activity = findActivityById(id);
  if (!activity) {
    console.log(`Aucune activité trouvée avec l'ID ${id}`);
    return;
  }
  
  console.log(`Propriétés de l'activité ${id} (${activity.title}):`);
  Object.keys(activity).forEach(key => {
    console.log(`- ${key}: ${JSON.stringify(activity[key], null, 2)}`);
  });
}
