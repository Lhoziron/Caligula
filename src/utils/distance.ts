import { Location } from 'expo-location';

// Fonction pour calculer la distance entre deux points en km
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Calcul de la distance à vol d'oiseau
  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceVolDOiseau = R * c;

  // Facteur de correction pour la distance à pied (environ 1.4 pour tenir compte des rues)
  const facteurCorrection = 1.4;
  const distanceReelle = distanceVolDOiseau * facteurCorrection;

  return distanceReelle;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Fonction pour formater la distance en texte
export function formatDistance(distance: number): string {
  if (distance < 1) {
    // Arrondir aux 10m les plus proches pour plus de précision
    const meters = Math.round(distance * 1000 / 10) * 10;
    return `${meters} m`;
  }
  // Arrondir à 100m près pour les distances en km
  return `${Math.round(distance * 10) / 10} km`;
}