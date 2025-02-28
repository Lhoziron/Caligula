import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuizStore } from '../src/store/quizStore';
import { useThemeStore } from '../src/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocationStore } from '../src/store/locationStore';
import { withErrorHandling } from '../src/utils/errorHandler';

const FOOD_QUESTIONS = [
  {
    id: 101,
    text: "Quel type de cuisine vous fait envie ?",
    icon: "🍽️",
    options: [
      "Française",
      "Italienne",
      "Japonaise",
      "Méditerranéenne",
      "Africaine",
      "Indienne",
      "Chinoise",
      "Street Food"
    ]
  },
  {
    id: 102,
    text: "Quel est votre budget par personne ?",
    icon: "💰",
    options: ["< 15€", "15-30€", "30-50€", "50€+"]
  },
  {
    id: 103,
    text: "Quelle ambiance recherchez-vous ?",
    icon: "✨",
    options: [
      "Décontractée",
      "Romantique",
      "Branchée",
      "Traditionnelle",
      "Gastronomique",
      "Fast-food",
      "Insolite"
    ]
  },
  {
    id: 104,
    text: "Préférence pour le moment du repas ?",
    icon: "⏰",
    options: ["Déjeuner", "Dîner", "Brunch", "En-cas", "Peu importe"]
  },
  {
    id: 105,
    text: "Des restrictions alimentaires ?",
    icon: "🥗",
    options: ["Végétarien", "Végan", "Sans gluten", "Halal", "Casher", "Aucune"]
  },
  {
    id: 106,
    text: "Plutôt sucré ou salé ?",
    icon: "🍰",
    options: ["Sucré (glaces, crêpes, pâtisseries...)", "Salé", "Les deux"]
  }
];

export default function FoodQuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { answers, setAnswer } = useQuizStore();
  const { isDark } = useThemeStore();
  const { selectedCountry, selectedCity } = useLocationStore();
  const [error, setError] = useState(null);

  // Ajouter automatiquement le pays et la ville aux réponses du quiz
  useEffect(() => {
    try {
      if (selectedCountry) {
        setAnswer(0, selectedCountry);
      }
      if (selectedCity) {
        setAnswer(1, selectedCity);
      }
    } catch (err) {
      console.error("Erreur lors de l'initialisation des réponses:", err);
      setError("Erreur lors de l'initialisation des réponses");
    }
  }, [selectedCountry, selectedCity, setAnswer]);

  const handleAnswer = withErrorHandling((answer) => {
    if (!FOOD_QUESTIONS || currentQuestionIndex >= FOOD_QUESTIONS.length) {
      return;
    }
    
    const currentQuestion = FOOD_QUESTIONS[currentQuestionIndex];
    if (!currentQuestion) return;
    
    setAnswer(currentQuestion.id, answer);
    
    if (currentQuestionIndex < FOOD_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push('/activities');
    }
  });

  const handleBack = withErrorHandling(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      router.back();
    }
  });

  // Vérifier si les questions sont valides
  if (!Array.isArray(FOOD_QUESTIONS) || FOOD_QUESTIONS.length === 0 || error) {
    return (
      <View style={[styles.container, !isDark && styles.lightContainer]}>
        <LinearGradient
          colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
          style={styles.background}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, !isDark && styles.lightErrorText]}>
            {error || "Une erreur est survenue lors du chargement des questions. Veuillez réessayer."}
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.errorButtonText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = FOOD_QUESTIONS[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <View style={[styles.container, !isDark && styles.lightContainer]}>
        <LinearGradient
          colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
          style={styles.background}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, !isDark && styles.lightErrorText]}>
            Question non trouvée. Veuillez réessayer.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.errorButtonText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, !isDark && styles.lightContainer]}>
      <LinearGradient
        colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
        style={styles.background}
      />

      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={[styles.backButton, !isDark && styles.lightBackButton]}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color={isDark ? "#fff" : "#000"} />
          <Text style={[styles.backButtonText, !isDark && styles.lightBackButtonText]}>Retour</Text>
        </TouchableOpacity>
      </View>

      {selectedCountry && selectedCity && (
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={16} color="#fff" />
          <Text style={styles.locationBadgeText}>
            {selectedCity}, {selectedCountry}
          </Text>
        </View>
      )}

      <View style={styles.quizTypeBadge}>
        <Ionicons name="restaurant" size={16} color="#fff" />
        <Text style={styles.quizTypeBadgeText}>Quiz Gastronomique</Text>
      </View>

      <Text style={[styles.progress, !isDark && styles.lightProgress]}>
        Question {currentQuestionIndex + 1}/{FOOD_QUESTIONS.length}
      </Text>

      <View style={styles.questionContainer}>
        <Text style={styles.questionIcon}>{currentQuestion.icon}</Text>
        <Text style={[styles.questionText, !isDark && styles.lightQuestionText]}>
          {currentQuestion.text}
        </Text>
      </View>

      <ScrollView style={styles.optionsContainer}>
        {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={`option-${index}`}
            style={[
              styles.optionButton,
              !isDark && styles.lightOptionButton,
              answers[currentQuestion.id] === option && (isDark ? styles.selectedOption : styles.lightSelectedOption)
            ]}
            onPress={() => handleAnswer(option)}
          >
            <Text style={[
              styles.optionText,
              !isDark && styles.lightOptionText,
              answers[currentQuestion.id] === option && styles.selectedOptionText
            ]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentQuestionIndex + 1) / FOOD_QUESTIONS.length) * 100}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  lightErrorText: {
    color: '#ff4444',
  },
  errorButton: {
    backgroundColor: '#FF3B7F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    padding: 8,
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
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 4,
  },
  lightBackButtonText: {
    color: '#000',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  locationBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  quizTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 15,
  },
  quizTypeBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  progress: {
    color: '#666',
    fontSize: 16,
    marginBottom: 30,
  },
  lightProgress: {
    color: '#999',
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  questionIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  lightQuestionText: {
    color: '#000',
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightOptionButton: {
    backgroundColor: '#fff',
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
  selectedOption: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
  },
  lightSelectedOption: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
  },
  lightOptionText: {
    color: '#000',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C00',
    borderRadius: 2,
  }
});