// Utilitaire pour vérifier les clés dupliquées dans les activités
import { activities } from '../data/activities';

// Fonction pour vérifier les doublons d'ID
export function checkDuplicateActivityIds() {
  const ids = {};
  const duplicates = [];
  
  activities.forEach(activity => {
    if (ids[activity.id]) {
      duplicates.push(activity.id);
    } else {
      ids[activity.id] = true;
    }
  });
  
  return {
    hasDuplicates: duplicates.length > 0,
    duplicateIds: duplicates,
    message: duplicates.length > 0 
      ? `Activités dupliquées trouvées avec les IDs: ${duplicates.join(', ')}` 
      : 'Aucun doublon d\'ID trouvé dans les activités'
  };
}

// Fonction pour vérifier les activités avec l'ID 3001
export function checkActivity3001() {
  const activity3001 = activities.filter(activity => activity.id === 3001);
  
  return {
    count: activity3001.length,
    activities: activity3001,
    message: `Trouvé ${activity3001.length} activité(s) avec l'ID 3001`
  };
}

// Fonction pour vérifier les clés utilisées lors du rendu des activités
export function suggestKeyFix() {
  return `
Pour résoudre l'erreur "Encountered two children with the same key '.$activity-3001'", 
essayez de modifier la façon dont vous générez les clés dans votre liste d'activités.

Au lieu de:
{activities.map((activity) => (
  <TouchableOpacity key={\`$activity-\${activity.id}\`}>
    ...
  </TouchableOpacity>
))}

Utilisez:
{activities.map((activity, index) => (
  <TouchableOpacity key={\`activity-\${activity.id}-\${index}\`}>
    ...
  </TouchableOpacity>
))}

Cela garantira que chaque clé est unique, même si vous avez deux activités avec le même ID.
`;
}