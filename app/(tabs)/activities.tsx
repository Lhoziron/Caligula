import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuizStore } from '../../src/store/quizStore';
import { useThemeStore } from '../../src/store/themeStore';
import { Activity } from '../../src/types/activity';
import { activities } from '../../src/data/activities';
import { matchActivitiesWithAnswers } from '../../src/utils/activityMatcher';
import ActivityMap from '../../src/components/ActivityMap';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useTranslatedActivities } from '../../src/hooks/useTranslatedActivities';
import { useTravelStore } from '../../src/store/travelStore';
import ActivityList from '../../src/components/ActivityList';

type ActivityType = 'all' | 'activity' | 'restaurant';

// Fonction pour normaliser les noms de pays (supprimer les accents, mettre en minuscule)
function normalizeCountryName(country: string | undefined): string {
  if (!country) return '';
  return country.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Fonction pour associer automatiquement les villes à leur pays
function getCityCountry(city: string): string | null {
  const cityCountryMap: Record<string, string> = {
    'Paris': 'France',
    'Marseille': 'France',
    'Lyon': 'France',
    'Bordeaux': 'France',
    'Strasbourg': 'France',
    'Nice': 'France',
    'Tokyo': 'Japon',
    'Kyoto': 'Japon',
    'Osaka': 'Japon',
    'Hiroshima': 'Japon',
    'Montréal': 'Canada',
    'Toronto': 'Canada',
    'Vancouver': 'Canada',
    'Québec': 'Canada',
    'Ottawa': 'Canada',
    'Marrakech': 'Maroc',
    'Casablanca': 'Maroc',
    'Fès': 'Maroc',
    'Rabat': 'Maroc',
    'Dakar': 'Sénégal',
    'Saint-Louis': 'Sénégal',
    'Abidjan': "Côte d'Ivoire",
    'Yamoussoukro': "Côte d'Ivoire",
    'Reykjavik': "Islande",
    'Akureyri': "Islande",
    'Vik': "Islande"
  };
  
  return cityCountryMap[city] || null;
}

export default function ActivitiesScreen() {
  const { t } = useTranslation();
  const { translateActivities } = useTranslatedActivities();
  const { answers, resetAnswers } = useQuizStore();
  const { isDark } = useThemeStore();
  const { getSortedDestinations } = useTravelStore();
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<ActivityType>('all');

  // Enrichir les activités avec les pays manquants
  const enrichedActivities = activities.map(activity => {
    if (!activity.country && activity.city) {
      const country = getCityCountry(activity.city);
      if (country) {
        return { ...activity, country };
      }
    }
    return activity;
  });

  // Obtenir la liste des pays depuis le TravelStore et les activités
  const travelDestinations = getSortedDestinations();
  const travelCountries = travelDestinations.map(dest => dest.name);
  
  // Fusionner les pays des activités avec ceux du TravelStore
  const activityCountries = Array.from(
    new Set(
      enrichedActivities
        .filter(activity => activity.country) // Filtrer les activités sans pays
        .map(activity => activity.country)
    )
  ).sort();
  
  const allCountries = Array.from(new Set([...travelCountries, ...activityCountries])).sort();

  // Obtenir la liste des villes pour le pays sélectionné
  const cities = Array.from(
    new Set(
      enrichedActivities
        .filter(activity => {
          if (!selectedCountry) return true;
          if (!activity.country) return false;
          return normalizeCountryName(activity.country) === normalizeCountryName(selectedCountry);
        })
        .map(activity => activity.city)
    )
  ).sort();

  useEffect(() => {
    async function loadActivities() {
      setIsLoading(true);
      setError(null);
      try {
        let matched = Object.keys(answers).length > 0 
          ? await matchActivitiesWithAnswers(enrichedActivities, answers)
          : [...enrichedActivities];

        // Filtrer par pays - utiliser normalizeCountryName pour une comparaison insensible à la casse et aux accents
        if (selectedCountry) {
          matched = matched.filter(activity => {
            if (!activity.country) return false;
            return normalizeCountryName(activity.country) === normalizeCountryName(selectedCountry);
          });
        }

        // Filtrer par ville
        if (selectedCity) {
          matched = matched.filter(activity => activity.city === selectedCity);
        }

        // Filtrer par type d'activité
        if (activityType !== 'all') {
          matched = matched.filter(activity => {
            const isRestaurant = activity.tags.some(tag => 
              ['gastronomie', 'restaurant', 'cuisine'].includes(tag.toLowerCase())
            );
            return activityType === 'restaurant' ? isRestaurant : !isRestaurant;
          });
        }

        const translatedActivities = translateActivities(matched);
        setFilteredActivities(translatedActivities);
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
        setError('Une erreur est survenue lors du chargement des activités.');
        setFilteredActivities([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadActivities();
  }, [answers, selectedCountry, selectedCity, activityType]);

  const handleReset = () => {
    resetAnswers();
    setSelectedCountry(null);
    setSelectedCity(null);
    setActivityType('all');
  };

  const handleCountrySelect = (country: string | null) => {
    setSelectedCountry(country);
    setSelectedCity(null); // Réinitialiser la ville lors du changement de pays
  };

  const handleCitySelect = (city: string | null) => {
    setSelectedCity(city);
  };

  return (
    <View style={[styles.container, !isDark && styles.lightContainer]}>
      <LinearGradient
        colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
        style={styles.background}
      />

      <View style={styles.header}>
        <Text style={[styles.title, !isDark && styles.lightTitle]}>
          {t('activities.header.title')}
        </Text>
        <Text style={[styles.subtitle, !isDark && styles.lightSubtitle]}>
          {Object.keys(answers).length > 0 
            ? t('activities.header.subtitle.withAnswers')
            : t('activities.header.subtitle.default')}
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.mapButton, !isDark && styles.lightMapButton]}
            onPress={() => setShowMap(true)}
          >
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>{t('activities.filters.map')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, !isDark && styles.lightFilterButton]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color={isDark ? "#fff" : "#000"} />
            <Text style={[styles.filterButtonText, !isDark && styles.lightFilterButtonText]}>
              {selectedCity ? selectedCity : selectedCountry ? selectedCountry : t('activities.filters.location')}
            </Text>
          </TouchableOpacity>

          {(selectedCountry || selectedCity || Object.keys(answers).length > 0) && (
            <TouchableOpacity
              style={[styles.resetButton, !isDark && styles.lightResetButton]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={20} color={isDark ? "#fff" : "#000"} />
              <Text style={[styles.resetButtonText, !isDark && styles.lightResetButtonText]}>
                {t('activities.filters.reset')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {showFilters && (
          <View style={[styles.filtersContainer, !isDark && styles.lightFiltersContainer]}>
            <Text style={[styles.filterTitle, !isDark && styles.lightFilterTitle]}>
              Pays
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !isDark && styles.lightFilterChip,
                  !selectedCountry && styles.activeFilterChip
                ]}
                onPress={() => handleCountrySelect(null)}
              >
                <Text style={[
                  styles.filterChipText,
                  !isDark && styles.lightFilterChipText,
                  !selectedCountry && styles.activeFilterChipText
                ]}>
                  Tous les pays
                </Text>
              </TouchableOpacity>
              {allCountries.map((country) => (
                <TouchableOpacity
                  key={`country-${country}`}
                  style={[
                    styles.filterChip,
                    !isDark && styles.lightFilterChip,
                    selectedCountry === country && styles.activeFilterChip
                  ]}
                  onPress={() => handleCountrySelect(country)}
                >
                  <Text style={[
                    styles.filterChipText,
                    !isDark && styles.lightFilterChipText,
                    selectedCountry === country && styles.activeFilterChipText
                  ]}>
                    {country}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedCountry && (
              <>
                <Text style={[styles.filterTitle, !isDark && styles.lightFilterTitle]}>
                  Villes
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !isDark && styles.lightFilterChip,
                      !selectedCity && styles.activeFilterChip
                    ]}
                    onPress={() => handleCitySelect(null)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      !isDark && styles.lightFilterChipText,
                      !selectedCity && styles.activeFilterChipText
                    ]}>
                      Toutes les villes
                    </Text>
                  </TouchableOpacity>
                  {cities.map((city) => (
                    <TouchableOpacity
                      key={`city-${city}`}
                      style={[
                        styles.filterChip,
                        !isDark && styles.lightFilterChip,
                        selectedCity === city && styles.activeFilterChip
                      ]}
                      onPress={() => handleCitySelect(city)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        !isDark && styles.lightFilterChipText,
                        selectedCity === city && styles.activeFilterChipText
                      ]}>
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        )}

        <View style={styles.typeFilterContainer}>
          <TouchableOpacity
            style={[
              styles.typeFilterButton,
              !isDark && styles.lightTypeFilterButton,
              activityType === 'all' && (isDark ? styles.activeTypeFilter : styles.lightActiveTypeFilter)
            ]}
            onPress={() => setActivityType('all')}
          >
            <Text style={[
              styles.typeFilterText,
              !isDark && styles.lightTypeFilterText,
              activityType === 'all' && styles.activeTypeFilterText
            ]}>
              {t('activities.filters.all')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeFilterButton,
              !isDark && styles.lightTypeFilterButton,
              activityType === 'activity' && (isDark ? styles.activeTypeFilter : styles.lightActiveTypeFilter)
            ]}
            onPress={() => setActivityType('activity')}
          >
            <Text style={[
              styles.typeFilterText,
              !isDark && styles.lightTypeFilterText,
              activityType === 'activity' && styles.activeTypeFilterText
            ]}>
              {t('activities.filters.activities')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeFilterButton,
              !isDark && styles.lightTypeFilterButton,
              activityType === 'restaurant' && (isDark ? styles.activeTypeFilter : styles.lightActiveTypeFilter)
            ]}
            onPress={() => setActivityType('restaurant')}
          >
            <Text style={[
              styles.typeFilterText,
              !isDark && styles.lightTypeFilterText,
              activityType === 'restaurant' && styles.activeTypeFilterText
            ]}>
              {t('activities.filters.restaurants')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <Text style={[styles.loadingText, !isDark && styles.lightLoadingText]}>
            {t('activities.loading.message')}
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorState}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.push('/quiz')}
          >
            <Text style={styles.retryButtonText}>{t('activities.error.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (!filteredActivities || filteredActivities.length === 0) ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={64} color={isDark ? "#666" : "#999"} />
          <Text style={[styles.emptyStateTitle, !isDark && styles.lightEmptyStateTitle]}>
            {t('activities.empty.title')}
          </Text>
          <Text style={[styles.emptyStateDescription, !isDark && styles.lightEmptyStateDescription]}>
            {t('activities.empty.description')}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.push('/quiz')}
          >
            <Text style={styles.retryButtonText}>{t('activities.empty.retryQuiz')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <ActivityList activities={filteredActivities} />
        </View>
      )}

      {showMap && (
        <ActivityMap
          activities={filteredActivities}
          onClose={() => setShowMap(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  lightTitle: {
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
  },
  lightSubtitle: {
    color: '#666',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    flexWrap: 'wrap',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B7F',
    padding: 12,
    borderRadius: 25,
    gap: 8,
  },
  lightMapButton: {
    backgroundColor: '#FF3B7F',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 25,
    gap: 8,
  },
  lightFilterButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  lightFilterButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 25,
    gap: 8,
  },
  lightResetButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  lightResetButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
  },
  lightFiltersContainer: {
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  lightFilterTitle: {
    color: '#000',
  },
  filterScroll: {
    marginBottom: 15,
  },
  filterChip: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  lightFilterChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterChip: {
    backgroundColor: '#FF3B7F',
  },
  filterChipText: {
    color: '#fff',
    fontSize: 14,
  },
  lightFilterChipText: {
    color: '#666',
  },
  activeFilterChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  typeFilterContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 4,
    marginTop: 15,
  },
  typeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  lightTypeFilterButton: {
    backgroundColor: '#f0f0f0',
  },
  activeTypeFilter: {
    backgroundColor: '#FF3B7F',
  },
  lightActiveTypeFilter: {
    backgroundColor: '#FF3B7F',
  },
  typeFilterText: {
    color: '#fff',
    fontSize: 14,
  },
  lightTypeFilterText: {
    color: '#666',
  },
  activeTypeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  lightLoadingText: {
    color: '#000',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  lightEmptyStateTitle: {
    color: '#000',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  lightEmptyStateDescription: {
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#FF3B7F',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});