import { activities } from '../data/activities';

// Type pour la structure de mapping pays-villes
export interface CountryCityMapping {
  [country: string]: string[];
}

// Fonction pour normaliser les noms (supprimer les accents, mettre en minuscule)
export function normalizeName(name: string | undefined): string {
  if (!name) return '';
  return name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Fonction pour générer dynamiquement le mapping pays-villes à partir des activités
export function generateCountryCityMapping(): CountryCityMapping {
  const mapping: CountryCityMapping = {};
  
  if (!Array.isArray(activities)) {
    console.warn('Les activités ne sont pas un tableau valide');
    return {};
  }
  
  activities.forEach(activity => {
    if (!activity || !activity.country || !activity.city) return;
    
    const country = activity.country.trim();
    const city = activity.city.trim();
    
    if (!mapping[country]) {
      mapping[country] = [];
    }
    
    if (!mapping[country].includes(city)) {
      mapping[country].push(city);
    }
  });
  
  // Trier les villes par ordre alphabétique pour chaque pays
  Object.keys(mapping).forEach(country => {
    mapping[country].sort();
  });
  
  return mapping;
}

// Mapping statique de vérification pour validation
export const VERIFIED_MAPPING: CountryCityMapping = {
  'France': ['Paris', 'Marseille', 'Lyon', 'Bordeaux', 'Strasbourg', 'Nice'],
  'Japon': ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Sapporo', 'Nara'],
  'Canada': ['Montréal', 'Toronto', 'Vancouver', 'Québec', 'Ottawa', 'Calgary'],
  'Maroc': ['Marrakech', 'Casablanca', 'Fès', 'Rabat', 'Tanger', 'Agadir'],
  'Sénégal': ['Dakar', 'Saint-Louis', 'Thiès', 'Ziguinchor', 'Touba', 'Mbour'],
  "Côte d'Ivoire": ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San Pedro', 'Korhogo', 'Man'],
  'Islande': ['Reykjavik', 'Akureyri', 'Vik', 'Husavik', 'Selfoss', 'Keflavik']
};

// Fonction pour vérifier la cohérence géographique d'une ville par rapport à un pays
export function isCityInCountry(city: string, country: string): boolean {
  // Vérifier d'abord dans le mapping vérifié
  if (VERIFIED_MAPPING[country] && VERIFIED_MAPPING[country].includes(city)) {
    return true;
  }
  
  // Vérifier ensuite dans le mapping dynamique
  const dynamicMapping = generateCountryCityMapping();
  return dynamicMapping[country]?.includes(city) || false;
}

// Fonction pour obtenir les villes d'un pays
export function getCitiesForCountry(country: string | null): string[] {
  if (!country) return [];
  
  // Combiner les villes du mapping vérifié et du mapping dynamique
  const verifiedCities = VERIFIED_MAPPING[country] || [];
  const dynamicMapping = generateCountryCityMapping();
  const dynamicCities = dynamicMapping[country] || [];
  
  // Fusionner et dédupliquer les listes
  const allCities = [...new Set([...verifiedCities, ...dynamicCities])];
  
  // Trier par ordre alphabétique
  return allCities.sort();
}

// Fonction pour valider la cohérence pays-ville
export function validateCountryCity(country: string | null, city: string | null): { valid: boolean; message: string } {
  if (!country || !city) {
    return { valid: true, message: '' }; // Pas de validation nécessaire si l'un des deux est null
  }
  
  if (isCityInCountry(city, country)) {
    return { valid: true, message: '' };
  }
  
  return { 
    valid: false, 
    message: `La ville "${city}" n'appartient pas au pays "${country}". Veuillez sélectionner une ville valide.` 
  };
}