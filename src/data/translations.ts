import { Activity } from '../types/activity';

type ActivityTranslations = {
  [key: number]: {
    en: Partial<Activity>;
    fr: Partial<Activity>;
  };
};

export const activityTranslations: ActivityTranslations = {
  // Paris
  1001: {
    fr: {
      title: "🎨 Musée d'Orsay",
      description: "Découvrez les chefs-d'œuvre de l'impressionnisme dans une ancienne gare du XIXe siècle.",
      transport: "🚇 Métro - Musée d'Orsay",
      transportDetails: "RER C, Métro ligne 12 - Station Musée d'Orsay",
      openingHours: ["Mardi-Dimanche: 9h30-18h00", "Jeudi: 9h30-21h45"]
    },
    en: {
      title: "🎨 Orsay Museum",
      description: "Discover impressionist masterpieces in a 19th century train station.",
      transport: "🚇 Metro - Musée d'Orsay",
      transportDetails: "RER C, Metro line 12 - Musée d'Orsay Station",
      openingHours: ["Tuesday-Sunday: 9:30 AM-6:00 PM", "Thursday: 9:30 AM-9:45 PM"]
    }
  },
  1002: {
    fr: {
      title: "🏛 Centre Pompidou",
      description: "Art moderne et contemporain dans un bâtiment emblématique au cœur de Paris.",
      transport: "🚇 Métro - Rambuteau",
      transportDetails: "Métro ligne 11 - Station Rambuteau",
      openingHours: ["Mercredi-Lundi: 11h00-21h00"]
    },
    en: {
      title: "🏛 Pompidou Center",
      description: "Modern and contemporary art in an iconic building in the heart of Paris.",
      transport: "🚇 Metro - Rambuteau",
      transportDetails: "Metro line 11 - Rambuteau Station",
      openingHours: ["Wednesday-Monday: 11:00 AM-9:00 PM"]
    }
  },
  1003: {
    fr: {
      title: "🌳 Jardin des Tuileries",
      description: "Balade dans un jardin historique entre le Louvre et la Place de la Concorde.",
      transport: "🚇 Métro - Tuileries",
      transportDetails: "Métro ligne 1 - Station Tuileries",
      openingHours: ["Tous les jours: 7h00-21h00"]
    },
    en: {
      title: "🌳 Tuileries Garden",
      description: "Stroll through a historic garden between the Louvre and Place de la Concorde.",
      transport: "🚇 Metro - Tuileries",
      transportDetails: "Metro line 1 - Tuileries Station",
      openingHours: ["Daily: 7:00 AM-9:00 PM"]
    }
  },
  1004: {
    fr: {
      title: "⛵️ Croisière sur la Seine",
      description: "Découvrez Paris depuis la Seine avec commentaires historiques.",
      transport: "🚇 Métro - Pont Neuf",
      transportDetails: "Métro ligne 7 - Station Pont Neuf",
      openingHours: ["Tous les jours: 10h00-22h00"]
    },
    en: {
      title: "⛵️ Seine River Cruise",
      description: "Discover Paris from the Seine with historical commentary.",
      transport: "🚇 Metro - Pont Neuf",
      transportDetails: "Metro line 7 - Pont Neuf Station",
      openingHours: ["Daily: 10:00 AM-10:00 PM"]
    }
  },
  1005: {
    fr: {
      title: "🥖 Atelier Boulangerie",
      description: "Apprenez à faire des croissants et des baguettes avec un maître boulanger.",
      transport: "🚇 Métro - Oberkampf",
      transportDetails: "Métro lignes 5, 9 - Station Oberkampf",
      openingHours: ["Mardi-Samedi: 9h00-12h00"]
    },
    en: {
      title: "🥖 Bakery Workshop",
      description: "Learn to make croissants and baguettes with a master baker.",
      transport: "🚇 Metro - Oberkampf",
      transportDetails: "Metro lines 5, 9 - Oberkampf Station",
      openingHours: ["Tuesday-Saturday: 9:00 AM-12:00 PM"]
    }
  },
  // Marseille
  3001: {
    fr: {
      title: "⛵️ Calanques en Bateau",
      description: "Découvrez les magnifiques calanques de Marseille lors d'une excursion en bateau. Admirez les falaises calcaires, les eaux turquoise et les criques secrètes de ce parc national unique.",
      transport: "🚇 Métro Vieux-Port",
      transportDetails: "Métro ligne 1 - Station Vieux-Port",
      openingHours: ["Tous les jours: 9h00-18h00", "Départs toutes les heures"]
    },
    en: {
      title: "⛵️ Calanques Boat Tour",
      description: "Discover the magnificent Calanques of Marseille during a boat excursion. Admire the limestone cliffs, turquoise waters, and secret coves of this unique national park.",
      transport: "🚇 Metro Vieux-Port",
      transportDetails: "Metro line 1 - Vieux-Port Station",
      openingHours: ["Daily: 9:00 AM-6:00 PM", "Departures every hour"]
    }
  },
  3002: {
    fr: {
      title: "🏛️ Visite du MUCEM",
      description: "Découvrez le Musée des Civilisations de l'Europe et de la Méditerranée, un incontournable de Marseille.",
      transport: "🚇 Métro Joliette",
      transportDetails: "Accessible via le tram T2 ou le métro ligne 2",
      openingHours: ["Mardi-Dimanche: 10h00-19h00", "Fermé le lundi"]
    },
    en: {
      title: "🏛️ MUCEM Visit",
      description: "Discover the Museum of European and Mediterranean Civilisations, a must-see in Marseille.",
      transport: "🚇 Metro Joliette",
      transportDetails: "Accessible via tram T2 or metro line 2",
      openingHours: ["Tuesday-Sunday: 10:00 AM-7:00 PM", "Closed on Mondays"]
    }
  }
};

export function getTranslatedActivity(activity: Activity, language: 'en' | 'fr'): Activity {
  const translations = activityTranslations[activity.id]?.[language];
  if (!translations) return activity;

  return {
    ...activity,
    ...translations
  };
}