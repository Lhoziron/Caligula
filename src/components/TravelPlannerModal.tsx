import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert, Linking, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useTravelStore, TravelDestination } from '../store/travelStore';
import RatingStars from './RatingStars';

interface TravelPlannerModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TravelPlannerModal({ visible, onClose }: TravelPlannerModalProps) {
  const { isDark } = useThemeStore();
  const { getDestination, getSortedDestinations, selectedDestination, setSelectedDestination } = useTravelStore();
  const [destination, setDestination] = useState<TravelDestination | null>(null);
  const [minimized, setMinimized] = useState(false);
  const minimizeAnim = useState(new Animated.Value(0))[0];
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({
    cost: 0,
    safety: 0,
    culture: 0,
    weather: 0,
    accessibility: 0
  });

  useEffect(() => {
    if (selectedDestination) {
      const dest = getDestination(selectedDestination);
      setDestination(dest);
      
      // Initialiser les évaluations de l'utilisateur avec celles du pays
      if (dest) {
        setUserRatings({
          cost: dest.ratings.cost,
          safety: dest.ratings.safety,
          culture: dest.ratings.culture,
          weather: dest.ratings.weather,
          accessibility: dest.ratings.accessibility
        });
      }
    } else {
      setDestination(null);
    }
  }, [selectedDestination, getDestination]);

  useEffect(() => {
    Animated.timing(minimizeAnim, {
      toValue: minimized ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [minimized, minimizeAnim]);

  const contentHeight = minimizeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90%', '30%'],
  });

  const handleLinkPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Erreur",
          "Impossible d'ouvrir ce lien"
        );
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'ouverture du lien"
      );
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  const handleRatingChange = (category: string, value: number) => {
    setUserRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const destinations = getSortedDestinations();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.container, 
            !isDark && styles.lightContainer,
            { height: contentHeight }
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, !isDark && styles.lightTitle]}>
              Préparer mon voyage
            </Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={toggleMinimize} 
                style={styles.minimizeButton}
              >
                <Ionicons 
                  name={minimized ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={isDark ? "#fff" : "#000"} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={onClose} 
                style={styles.closeButton}
              >
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={isDark ? "#fff" : "#000"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.destinationSelector}>
            <View style={styles.selectorLabel}>
              <Text style={[styles.selectorLabelText, !isDark && styles.lightSelectorLabelText]}>
                Choisir un pays
              </Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.countriesScroll}
              contentContainerStyle={styles.countriesContent}
            >
              {destinations.map((dest) => (
                <TouchableOpacity
                  key={dest.id}
                  style={[
                    styles.countryButton,
                    !isDark && styles.lightCountryButton,
                    selectedDestination === dest.id && styles.selectedCountryButton
                  ]}
                  onPress={() => {
                    setSelectedDestination(dest.id);
                    if (minimized) setMinimized(false);
                  }}
                >
                  <Text style={[
                    styles.countryButtonText,
                    !isDark && styles.lightCountryButtonText,
                    selectedDestination === dest.id && styles.selectedCountryButtonText
                  ]}>
                    {dest.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {!minimized && destination ? (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <Text style={[styles.destinationTitle, !isDark && styles.lightDestinationTitle]}>
                {destination.name}
              </Text>
              <Text style={[styles.destinationDescription, !isDark && styles.lightDestinationDescription]}>
                {destination.description}
              </Text>

              <View style={[styles.infoCard, !isDark && styles.lightInfoCard]}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, !isDark && styles.lightInfoLabel]}>
                      Capitale
                    </Text>
                    <Text style={[styles.infoValue, !isDark && styles.lightInfoValue]}>
                      {destination.capital}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, !isDark && styles.lightInfoLabel]}>
                      Monnaie
                    </Text>
                    <Text style={[styles.infoValue, !isDark && styles.lightInfoValue]}>
                      {destination.currency}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, !isDark && styles.lightInfoLabel]}>
                      Langue
                    </Text>
                    <Text style={[styles.infoValue, !isDark && styles.lightInfoValue]}>
                      {destination.languages.primary}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, !isDark && styles.lightInfoLabel]}>
                      Français parlé
                    </Text>
                    <Text style={[styles.infoValue, !isDark && styles.lightInfoValue]}>
                      {destination.languages.french === 'high' ? 'Courant' : 
                       destination.languages.french === 'medium' ? 'Moyen' : 'Rare'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.section, !isDark && styles.lightSection]}>
                <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
                  Budget hebdomadaire
                </Text>
                <View style={styles.budgetContainer}>
                  <View style={styles.budgetItem}>
                    <Text style={[styles.budgetLabel, !isDark && styles.lightBudgetLabel]}>
                      Économique
                    </Text>
                    <Text style={[styles.budgetValue, !isDark && styles.lightBudgetValue]}>
                      {destination.weeklyBudget.low}€
                    </Text>
                  </View>
                  <View style={styles.budgetItem}>
                    <Text style={[styles.budgetLabel, !isDark && styles.lightBudgetLabel]}>
                      Moyen
                    </Text>
                    <Text style={[styles.budgetValue, !isDark && styles.lightBudgetValue]}>
                      {destination.weeklyBudget.medium}€
                    </Text>
                  </View>
                  <View style={styles.budgetItem}>
                    <Text style={[styles.budgetLabel, !isDark && styles.lightBudgetLabel]}>
                      Confort
                    </Text>
                    <Text style={[styles.budgetValue, !isDark && styles.lightBudgetValue]}>
                      {destination.weeklyBudget.high}€
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.section, !isDark && styles.lightSection]}>
                <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
                  Évaluations
                </Text>
                <View style={styles.ratingsContainer}>
                  <View style={styles.ratingItem}>
                    <Text style={[styles.ratingLabel, !isDark && styles.lightRatingLabel]}>
                      Coût
                    </Text>
                    <RatingStars 
                      rating={userRatings.cost} 
                      size={24}
                      interactive={true}
                      onRatingChange={(value) => handleRatingChange('cost', value)}
                    />
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={[styles.ratingLabel, !isDark && styles.lightRatingLabel]}>
                      Sécurité
                    </Text>
                    <RatingStars 
                      rating={userRatings.safety} 
                      size={24}
                      interactive={true}
                      onRatingChange={(value) => handleRatingChange('safety', value)}
                    />
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={[styles.ratingLabel, !isDark && styles.lightRatingLabel]}>
                      Attractivité touristique
                    </Text>
                    <RatingStars 
                      rating={userRatings.culture} 
                      size={24}
                      interactive={true}
                      onRatingChange={(value) => handleRatingChange('culture', value)}
                    />
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={[styles.ratingLabel, !isDark && styles.lightRatingLabel]}>
                      Climat
                    </Text>
                    <RatingStars 
                      rating={userRatings.weather} 
                      size={24}
                      interactive={true}
                      onRatingChange={(value) => handleRatingChange('weather', value)}
                    />
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={[styles.ratingLabel, !isDark && styles.lightRatingLabel]}>
                      Accessibilité
                    </Text>
                    <RatingStars 
                      rating={userRatings.accessibility} 
                      size={24}
                      interactive={true}
                      onRatingChange={(value) => handleRatingChange('accessibility', value)}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.section, !isDark && styles.lightSection]}>
                <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
                  À prévoir avant le départ
                </Text>
                {destination.preparations.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listBullet}>•</Text>
                    <Text style={[styles.listText, !isDark && styles.lightListText]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={[styles.section, !isDark && styles.lightSection]}>
                <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
                  Recommandations
                </Text>
                {destination.recommendations.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listBullet}>•</Text>
                    <Text style={[styles.listText, !isDark && styles.lightListText]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={[styles.section, !isDark && styles.lightSection]}>
                <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
                  Avertissements
                </Text>
                {destination.warnings.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listBullet}>•</Text>
                    <Text style={[styles.listText, !isDark && styles.lightListText]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={[styles.section, !isDark && styles.lightSection]}>
                <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
                  Liens utiles
                </Text>
                {Object.entries(destination.officialLinks).map(([key, url]) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.linkButton}
                    onPress={() => handleLinkPress(url)}
                  >
                    <Text style={styles.linkButtonText}>
                      {key === 'embassy' ? 'Ambassade' : 
                       key === 'tourism' ? 'Office du tourisme' : 
                       'Informations santé'}
                    </Text>
                    <Ionicons name="open-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : !minimized && !destination ? (
            <View style={styles.emptyState}>
              <Ionicons name="earth" size={64} color={isDark ? "#666" : "#999"} />
              <Text style={[styles.emptyStateText, !isDark && styles.lightEmptyStateText]}>
                Sélectionnez un pays pour commencer à planifier votre voyage
              </Text>
            </View>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  lightTitle: {
    color: '#000',
  },
  closeButton: {
    padding: 5,
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minimizeButton: {
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationSelector: {
    padding: 20,
    paddingBottom: 10,
  },
  selectorLabel: {
    marginBottom: 10,
  },
  selectorLabelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lightSelectorLabelText: {
    color: '#000',
  },
  countriesScroll: {
    flexGrow: 0,
  },
  countriesContent: {
    paddingRight: 20,
  },
  countryButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  lightCountryButton: {
    backgroundColor: '#f0f0f0',
  },
  selectedCountryButton: {
    backgroundColor: '#FF3B7F',
  },
  countryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  lightCountryButtonText: {
    color: '#666',
  },
  selectedCountryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  destinationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  lightDestinationTitle: {
    color: '#000',
  },
  destinationDescription: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    lineHeight: 24,
  },
  lightDestinationDescription: {
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  lightInfoCard: {
    backgroundColor: '#f5f5f5',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  lightInfoLabel: {
    color: '#666',
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  lightInfoValue: {
    color: '#000',
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  lightSection: {
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  lightSectionTitle: {
    color: '#000',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
  },
  budgetLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  lightBudgetLabel: {
    color: '#666',
  },
  budgetValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lightBudgetValue: {
    color: '#000',
  },
  ratingsContainer: {
    gap: 15,
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingLabel: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  lightRatingLabel: {
    color: '#000',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  listBullet: {
    color: '#FF3B7F',
    fontSize: 16,
    marginRight: 10,
  },
  listText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  lightListText: {
    color: '#000',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF3B7F',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  lightEmptyStateText: {
    color: '#999',
  },
});