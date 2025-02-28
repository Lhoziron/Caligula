import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../src/store/themeStore';
import { useTravelStore } from '../src/store/travelStore';
import { useTranslation } from '../src/hooks/useTranslation';
import { useLocationStore } from '../src/store/locationStore';
import CitySelector from '../src/components/CitySelector';

export default function CountrySelectionScreen() {
  const { isDark } = useThemeStore();
  const { t } = useTranslation();
  const { getSortedDestinations } = useTravelStore();
  const { selectedCountry, setSelectedCountry, selectedCity } = useLocationStore();
  const [showCitySelector, setShowCitySelector] = useState(false);
  const params = useLocalSearchParams();
  const quizType = (params?.quizType as string) || 'regular';

  // Vérifier que getSortedDestinations retourne un tableau valide
  const destinations = getSortedDestinations() || [];

  const handleCountrySelect = (countryId: string) => {
    try {
      const country = destinations.find(d => d.id === countryId);
      const countryName = country?.name || null;
      setSelectedCountry(countryName);
      setShowCitySelector(true);
    } catch (error) {
      console.error('Erreur lors de la sélection du pays:', error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sélection du pays. Veuillez réessayer."
      );
    }
  };

  const handleCitySelected = (city: string) => {
    try {
      // Rediriger vers le quiz approprié en fonction du type
      if (quizType === 'food') {
        router.push('/food-quiz');
      } else {
        router.push('/quiz');
      }
    } catch (error) {
      console.error('Erreur lors de la redirection vers le quiz:', error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la navigation. Veuillez réessayer."
      );
    }
  };

  const getCountryImage = (countryId: string) => {
    if (!countryId) return 'https://images.unsplash.com/photo-1589519160732-576f165b9aad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    
    const imageMap: Record<string, string> = {
      'france': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'japon': 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2092&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'canada': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'maroc': 'https://images.pexels.com/photos/3581916/pexels-photo-3581916.jpeg?cs=srgb&dl=pexels-mographe-3581916.jpg&fm=jpg',
      'senegal': 'https://images.unsplash.com/photo-1611258900587-7ec9262dac1c?q=80&w=3912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'cote-ivoire': 'https://discover-ivorycoast.com/wp-content/uploads/2019/07/Les-belles-plages8-1.jpg',
      'islande': 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    };
    
    return imageMap[countryId] || 'https://images.unsplash.com/photo-1589519160732-576f165b9aad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  };

  return (
    <View style={[styles.container, !isDark && styles.lightContainer]}>
      <LinearGradient
        colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
        style={styles.background}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, !isDark && styles.lightBackButton]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.title, !isDark && styles.lightTitle]}>
          Sélectionner votre destination
        </Text>
      </View>

      <View style={styles.quizTypeIndicator}>
        <View style={[
          styles.quizTypeBadge, 
          quizType === 'food' ? styles.foodQuizBadge : styles.regularQuizBadge
        ]}>
          <Ionicons 
            name={quizType === 'food' ? "restaurant" : "compass"} 
            size={16} 
            color="#fff" 
          />
          <Text style={styles.quizTypeBadgeText}>
            {quizType === 'food' ? 'Quiz Gastronomique' : 'Quiz Activités'}
          </Text>
        </View>
      </View>

      <Text style={[styles.subtitle, !isDark && styles.lightSubtitle]}>
        Pour mieux personnaliser les {quizType === 'food' ? 'restaurants' : 'activités'} qui correspondent à tes envies, commençons par situer ta destination.
      </Text>

      {!showCitySelector ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.countriesGrid}>
            {Array.isArray(destinations) && destinations.map((destination) => (
              destination && destination.id && (
                <TouchableOpacity
                  key={destination.id}
                  style={[
                    styles.countryCard,
                    !isDark && styles.lightCountryCard,
                    selectedCountry === destination.name && styles.selectedCountryCard
                  ]}
                  onPress={() => handleCountrySelect(destination.id)}
                >
                  <Image
                    source={{ uri: getCountryImage(destination.id) }}
                    style={styles.countryImage}
                  />
                  <View style={styles.countryInfo}>
                    <Text style={[styles.countryName, !isDark && styles.lightCountryName]}>
                      {destination.name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Ionicons
                          key={index}
                          name={index < (destination.ratings?.culture || 0) ? "star" : "star-outline"}
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              )
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.citySelectorContainer}>
          <Text style={[styles.citySelectorTitle, !isDark && styles.lightCitySelectorTitle]}>
            Dans quelle ville ?
          </Text>
          <CitySelector onCitySelected={handleCitySelected} />
        </View>
      )}

      {!showCitySelector && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selectedCountry) && styles.disabledButton
            ]}
            onPress={() => selectedCountry && setShowCitySelector(true)}
            disabled={!selectedCountry}
          >
            <Text style={styles.continueButtonText}>
              Continuer
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lightBackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  lightTitle: {
    color: '#000',
  },
  quizTypeIndicator: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  quizTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  regularQuizBadge: {
    backgroundColor: '#FF3B7F',
  },
  foodQuizBadge: {
    backgroundColor: '#FF8C00',
  },
  quizTypeBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    paddingHorizontal: 20,
    marginBottom: 20,
    lineHeight: 24,
  },
  lightSubtitle: {
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  countriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  countryCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  lightCountryCard: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCountryCard: {
    borderColor: '#FF3B7F',
  },
  countryImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  countryInfo: {
    padding: 10,
  },
  countryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  lightCountryName: {
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  citySelectorContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  citySelectorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  lightCitySelectorTitle: {
    color: '#000',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#FF3B7F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});