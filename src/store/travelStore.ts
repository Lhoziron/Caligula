import { create } from 'zustand';

export interface TravelDestination {
  id: string;
  name: string;
  capital: string;
  description: string;
  currency: string;
  languages: {
    primary: string;
    french: 'low' | 'medium' | 'high';
    english: 'low' | 'medium' | 'high';
  };
  weeklyBudget: {
    low: number;
    medium: number;
    high: number;
  };
  ratings: {
    cost: number;
    safety: number;
    culture: number;
    weather: number;
    accessibility: number;
  };
  preparations: string[];
  recommendations: string[];
  warnings: string[];
  officialLinks: {
    embassy?: string;
    tourism?: string;
    health?: string;
  };
}

interface TravelState {
  destinations: { [key: string]: TravelDestination };
  selectedDestination: string | null;
  setSelectedDestination: (id: string | null) => void;
  getDestination: (id: string) => TravelDestination | null;
  getSortedDestinations: () => TravelDestination[];
}

const INITIAL_DESTINATIONS: { [key: string]: TravelDestination } = {
  'canada': {
    id: 'canada',
    name: 'Canada',
    capital: 'Ottawa',
    description: "Le Canada séduit par ses grands espaces sauvages et sa diversité culturelle. Des montagnes Rocheuses aux chutes du Niagara, en passant par les métropoles cosmopolites, découvrez un pays où nature et modernité coexistent en harmonie.",
    currency: 'CAD',
    languages: {
      primary: 'Anglais et Français',
      french: 'high',
      english: 'high'
    },
    weeklyBudget: {
      low: 600,
      medium: 1200,
      high: 2000
    },
    ratings: {
      cost: 2,
      safety: 5,
      culture: 4,
      weather: 3,
      accessibility: 5
    },
    preparations: [
      "Passeport valide",
      "AVE (Autorisation de Voyage Électronique)",
      "Assurance voyage et santé",
      "Vêtements adaptés aux saisons",
      "Réservations d'hébergement à l'avance"
    ],
    recommendations: [
      "Parc national de Banff",
      "Chutes du Niagara",
      "Vieux-Québec",
      "CN Tower à Toronto",
      "Observation des aurores boréales"
    ],
    warnings: [
      "Températures extrêmes en hiver",
      "Coût de la vie élevé",
      "Distances importantes entre les villes",
      "Faune sauvage dans les parcs",
      "Variations climatiques importantes"
    ],
    officialLinks: {
      tourism: "https://www.canada.ca/fr/services/tourisme.html",
      health: "https://www.canada.ca/fr/sante-publique.html"
    }
  },
  'cote-ivoire': {
    id: 'cote-ivoire',
    name: "Côte d'Ivoire",
    capital: 'Yamoussoukro',
    description: "La Côte d'Ivoire séduit par sa diversité culturelle et sa richesse naturelle. Un pays où forêts tropicales et plages de sable fin côtoient une culture vibrante, où l'art, la musique et la gastronomie créent une expérience unique.",
    currency: 'XOF - Franc CFA',
    languages: {
      primary: 'Français',
      french: 'high',
      english: 'low'
    },
    weeklyBudget: {
      low: 300,
      medium: 600,
      high: 1000
    },
    ratings: {
      cost: 2,
      safety: 3,
      culture: 5,
      weather: 4,
      accessibility: 3
    },
    preparations: [
      "Passeport valide 6 mois après le retour",
      "Visa obligatoire",
      "Vaccin fièvre jaune obligatoire",
      "Traitement antipaludéen recommandé",
      "Assurance voyage indispensable"
    ],
    recommendations: [
      "Basilique Notre-Dame de la Paix à Yamoussoukro",
      "Parc national de Taï",
      "Plages de Grand-Bassam",
      "Marché artisanal de Treichville",
      "Parc national de la Comoé"
    ],
    warnings: [
      "Éviter les zones frontalières sensibles",
      "Vigilance dans les grandes villes",
      "Attention aux arnaques touristiques",
      "Protection contre les moustiques",
      "Boire uniquement de l'eau en bouteille"
    ],
    officialLinks: {
      tourism: "https://tourisme.gouv.ci",
      health: "https://www.sante.gouv.ci"
    }
  },
  'france': {
    id: 'france',
    name: 'France',
    capital: 'Paris',
    description: "La France enchante par son patrimoine culturel exceptionnel et sa gastronomie mondialement reconnue. Des châteaux de la Loire aux plages de la Côte d'Azur, en passant par les sommets alpins, chaque région offre une expérience unique.",
    currency: 'EUR',
    languages: {
      primary: 'Français',
      french: 'high',
      english: 'medium'
    },
    weeklyBudget: {
      low: 500,
      medium: 1000,
      high: 2000
    },
    ratings: {
      cost: 3,
      safety: 4,
      culture: 5,
      weather: 4,
      accessibility: 5
    },
    preparations: [
      "Carte d'identité ou passeport",
      "Carte européenne d'assurance maladie (UE)",
      "Réservations restaurants/musées conseillées",
      "Adaptateur électrique (UK/US)",
      "Quelques phrases en français"
    ],
    recommendations: [
      "Tour Eiffel et Musée du Louvre",
      "Châteaux de la Loire",
      "Mont Saint-Michel",
      "Promenade sur la Côte d'Azur",
      "Dégustation de vins en Bourgogne"
    ],
    warnings: [
      "Pickpockets dans les zones touristiques",
      "Restaurants touristiques à éviter",
      "Grèves possibles des transports",
      "Heures de fermeture des commerces",
      "Éviter les périodes de vacances scolaires"
    ],
    officialLinks: {
      tourism: "https://www.france.fr",
      health: "https://www.sante.gouv.fr"
    }
  },
  'islande': {
    id: 'islande',
    name: 'Islande',
    capital: 'Reykjavik',
    description: "L'Islande fascine par ses paysages lunaires, ses volcans actifs et ses sources d'eau chaude naturelles. Terre de feu et de glace, ce pays nordique offre une expérience unique entre aurores boréales, geysers et cascades spectaculaires.",
    currency: 'ISK',
    languages: {
      primary: 'Islandais',
      french: 'low',
      english: 'high'
    },
    weeklyBudget: {
      low: 800,
      medium: 1500,
      high: 2500
    },
    ratings: {
      cost: 1,
      safety: 5,
      culture: 4,
      weather: 2,
      accessibility: 4
    },
    preparations: [
      "Passeport ou carte d'identité (UE)",
      "Vêtements chauds et imperméables",
      "Crampons pour la glace (hiver)",
      "Réservation de voiture à l'avance",
      "Budget conséquent pour la nourriture"
    ],
    recommendations: [
      "Cercle d'Or (Geysir, Gullfoss, Thingvellir)",
      "Lagon Bleu",
      "Plage de sable noir de Reynisfjara",
      "Glacier Vatnajökull",
      "Observation des aurores boréales (sept-avril)"
    ],
    warnings: [
      "Conditions météo changeantes et imprévisibles",
      "Coût de la vie très élevé",
      "Conduite difficile en hiver",
      "Respecter les sentiers balisés",
      "Ne pas s'approcher des bords de falaises"
    ],
    officialLinks: {
      tourism: "https://www.visiticeland.com",
      health: "https://www.landlaeknir.is/english/"
    }
  },
  'japon': {
    id: 'japon',
    name: 'Japon',
    capital: 'Tokyo',
    description: "Le Japon fascine par son mélange unique de traditions ancestrales et d'innovations futuristes. Des temples zen aux gratte-ciels de Tokyo, en passant par la gastronomie raffinée, découvrez un pays où passé et futur se rencontrent.",
    currency: 'JPY',
    languages: {
      primary: 'Japonais',
      french: 'low',
      english: 'medium'
    },
    weeklyBudget: {
      low: 700,
      medium: 1500,
      high: 3000
    },
    ratings: {
      cost: 2,
      safety: 5,
      culture: 5,
      weather: 4,
      accessibility: 5
    },
    preparations: [
      "Passeport valide",
      "Japan Rail Pass avant le départ",
      "Réservations d'hébergement",
      "Application de traduction",
      "Carte de crédit internationale"
    ],
    recommendations: [
      "Temple Senso-ji à Tokyo",
      "Mont Fuji",
      "Temples de Kyoto",
      "Parc aux daims de Nara",
      "Quartier de Shibuya"
    ],
    warnings: [
      "Coût de la vie élevé",
      "Barrière de la langue",
      "Risques sismiques",
      "Période des typhons (été-automne)",
      "Règles d'étiquette strictes"
    ],
    officialLinks: {
      tourism: "https://www.japan.travel/fr/",
      health: "https://www.mhlw.go.jp/english/"
    }
  },
  'maroc': {
    id: 'maroc',
    name: 'Maroc',
    capital: 'Rabat',
    description: "Le Maroc séduit par ses médinas labyrinthiques et ses paysages contrastés. Des souks animés de Marrakech aux dunes du Sahara, en passant par les montagnes de l'Atlas, vivez une expérience sensorielle unique entre tradition et modernité.",
    currency: 'MAD',
    languages: {
      primary: 'Arabe',
      french: 'high',
      english: 'medium'
    },
    weeklyBudget: {
      low: 300,
      medium: 600,
      high: 1200
    },
    ratings: {
      cost: 4,
      safety: 4,
      culture: 5,
      weather: 4,
      accessibility: 4
    },
    preparations: [
      "Passeport valide",
      "Respect des coutumes locales",
      "Tenue vestimentaire adaptée",
      "Vaccins recommandés à jour",
      "Assurance voyage"
    ],
    recommendations: [
      "Médina de Marrakech",
      "Désert du Sahara",
      "Fès",
      "Chefchaouen",
      "Essaouira"
    ],
    warnings: [
      "Attention aux pickpockets",
      "Marchandage obligatoire",
      "Éviter certains quartiers la nuit",
      "Respect des traditions pendant le Ramadan",
      "Eau du robinet déconseillée"
    ],
    officialLinks: {
      tourism: "https://www.visitmorocco.com",
      health: "https://www.sante.gov.ma"
    }
  },
  'senegal': {
    id: 'senegal',
    name: 'Sénégal',
    capital: 'Dakar',
    description: "Le Sénégal enchante par ses plages dorées, sa culture vibrante et son hospitalité légendaire. De Dakar la cosmopolite à la mystique île de Gorée, en passant par les parcs nationaux, découvrez un pays riche en histoire et en émotions.",
    currency: 'XOF - Franc CFA',
    languages: {
      primary: 'Français (Wolof langue nationale)',
      french: 'high',
      english: 'low'
    },
    weeklyBudget: {
      low: 300,
      medium: 600,
      high: 1000
    },
    ratings: {
      cost: 4,
      safety: 4,
      culture: 5,
      weather: 4,
      accessibility: 3
    },
    preparations: [
      "Passeport valide 6 mois après le retour",
      "Visa selon nationalité",
      "Vaccin fièvre jaune recommandé",
      "Traitement antipaludéen conseillé",
      "Assurance voyage"
    ],
    recommendations: [
      "Île de Gorée",
      "Parc national du Djoudj",
      "Lac Rose",
      "Saint-Louis",
      "Réserve de Bandia"
    ],
    warnings: [
      "Éviter la Casamance / y aller avec un guide de confiance",
      "Attention aux arnaques touristiques",
      "Protection contre le soleil",
      "Boire uniquement de l'eau en bouteille",
      "Éviter les plages isolées la nuit"
    ],
    officialLinks: {
      tourism: "https://www.tourisme.gouv.sn",
      health: "https://www.sante.gouv.sn"
    }
  }
};

export const useTravelStore = create<TravelState>((set, get) => ({
  destinations: INITIAL_DESTINATIONS,
  selectedDestination: null,
  setSelectedDestination: (id) => set({ selectedDestination: id }),
  getDestination: (id) => get().destinations[id] || null,
  getSortedDestinations: () => 
    Object.values(get().destinations).sort((a, b) => a.name.localeCompare(b.name))
}));