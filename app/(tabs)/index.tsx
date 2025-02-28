import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useLanguageStore } from '../../src/store/languageStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import TravelPlannerModal from '../../src/components/TravelPlannerModal';
import { useLocationStore } from '../../src/store/locationStore';
import { useQuizStore } from '../../src/store/quizStore';

export default function HomeScreen() {
  const { isDark } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { resetFilters } = useLocationStore();
  const { resetAnswers } = useQuizStore();
  const [showTravelPlanner, setShowTravelPlanner] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const handleQuizStart = (quizType: 'regular' | 'food') => {
    // Réinitialiser les réponses avant de commencer un nouveau quiz
    resetAnswers();
    
    // Rediriger vers la sélection de pays avec le type de quiz
    router.push({
      pathname: '/country-selection',
      params: { quizType }
    });
  };

  return (
    <View style={[styles.container, !isDark && styles.lightContainer]}>
      <LinearGradient
        colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, !isDark && styles.lightTitle]}>
            {t('discover.title')}
          </Text>
          <TouchableOpacity
            style={[styles.languageButton, !isDark && styles.lightLanguageButton]}
            onPress={toggleLanguage}
          >
            <Text style={[styles.languageButtonText, !isDark && styles.lightLanguageButtonText]}>
              {language.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, !isDark && styles.lightSubtitle]}>
          {t('discover.subtitle')}
        </Text>
      </View>

      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
        style={styles.image}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !isDark && styles.lightButton]}
          onPress={() => handleQuizStart('regular')}
        >
          <Text style={styles.buttonText}>{t('discover.quickQuiz.title')}</Text>
          <Text style={[styles.buttonSubtext, { color: isDark ? '#ddd' : '#666' }]}>
            {t('discover.quickQuiz.subtitle')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.foodButton, !isDark && styles.lightFoodButton]}
          onPress={() => handleQuizStart('food')}
        >
          <Text style={styles.buttonText}>{t('discover.foodQuiz.title')}</Text>
          <Text style={[styles.buttonSubtext, { color: isDark ? '#ddd' : '#666' }]}>
            {t('discover.foodQuiz.subtitle')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.travelButton, !isDark && styles.lightTravelButton]}
          onPress={() => setShowTravelPlanner(true)}
        >
          <Text style={styles.buttonText}>Je prépare mon voyage 🌍</Text>
          <Text style={[styles.buttonSubtext, { color: isDark ? '#ddd' : '#666' }]}>
            5 choses à prévoir • 5 à faire • 5 à éviter
          </Text>
        </TouchableOpacity>
      </View>

      <TravelPlannerModal
        visible={showTravelPlanner}
        onClose={() => setShowTravelPlanner(false)}
      />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  lightTitle: {
    color: '#000',
  },
  languageButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 15,
  },
  lightLanguageButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lightLanguageButtonText: {
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  lightSubtitle: {
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
  },
  button: {
    backgroundColor: '#FF3B7F',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  lightButton: {
    backgroundColor: '#FF3B7F',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foodButton: {
    backgroundColor: '#FF8C00',
  },
  lightFoodButton: {
    backgroundColor: '#FF8C00',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  travelButton: {
    backgroundColor: '#4CAF50',
  },
  lightTravelButton: {
    backgroundColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
  }
});