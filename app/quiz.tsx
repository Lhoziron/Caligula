import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuizStore } from '../src/store/quizStore';
import { useThemeStore } from '../src/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocationStore } from '../src/store/locationStore';
import { withErrorHandling } from '../src/utils/errorHandler';

const QUIZ_QUESTIONS = [
  {
    id: 2,
    text: "Nombre de participants ?",
    icon: "👥",
    options: ["Seul(e)", "En duo", "Petit groupe (3-5)", "Grand groupe (6+)"]
  },
  {
    id: 3,
    text: "Type de relation ?",
    icon: "💝",
    options: ["Famille", "Amis", "Couple", "Collègues", "Avec enfants"]
  },
  {
    id: 4,
    text: "Ambiance recherchée ?",
    icon: "✨",
    options: ["Détente", "Fun et énergique", "Sportif", "Culturel", "Nature"]
  },
  {
    id: 5,
    text: "Budget ?",
    icon: "💰",
    options: ["Gratuit", "< 25€", "25-50€", "50-100€", "Peu importe"]
  },
  {
    id: 6,
    text: "Préférences spécifiques ?",
    icon: "🎯",
    options: [
      "Intérieur",
      "Extérieur",
      "Jour",
      "Soirée",
      "Activité physique",
      "Ludique",
      "Créatif",
      "Nature"
    ],
    multiSelect: true
  }
];

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
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
    // Pour la dernière question (préférences spécifiques)
    if (currentQuestionIndex < QUIZ_QUESTIONS.length && QUIZ_QUESTIONS[currentQuestionIndex].multiSelect) {
      const newPreferences = selectedPreferences.includes(answer)
        ? selectedPreferences.filter(pref => pref !== answer)
        : [...selectedPreferences, answer];
      setSelectedPreferences(newPreferences);
      setAnswer(QUIZ_QUESTIONS[currentQuestionIndex].id, newPreferences.join(', '));
      return;
    }
    
    if (currentQuestionIndex < QUIZ_QUESTIONS.length) {
      setAnswer(QUIZ_QUESTIONS[currentQuestionIndex].id, answer);
    }
    
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  });

  const handleNext = withErrorHandling(() => {
    router.push('/activities');
  });

  const handleBack = withErrorHandling(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      router.back();
    }
  });

  // Vérifier si les questions sont valides
  if (!Array.isArray(QUIZ_QUESTIONS) || QUIZ_QUESTIONS.length === 0 || error) {
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

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;
  
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
        <Ionicons name="compass" size={16} color="#fff" />
        <Text style={styles.quizTypeBadgeText}>Quiz Activités</Text>
      </View>

      <Text style={[styles.progress, !isDark && styles.lightProgress]}>
        Question {currentQuestionIndex + 1}/{QUIZ_QUESTIONS.length}
      </Text>

      <View style={styles.questionContainer}>
        <Text style={styles.questionIcon}>{currentQuestion.icon}</Text>
        <Text style={[styles.questionText, !isDark && styles.lightQuestionText]}>
          {currentQuestion.text}
        </Text>
      </View>

      <ScrollView style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={`option-${index}`}
            style={[
              styles.optionButton,
              !isDark && styles.lightOptionButton,
              currentQuestion.multiSelect && selectedPreferences.includes(option) && 
                (isDark ? styles.selectedOption : styles.lightSelectedOption)
            ]}
            onPress={() => handleAnswer(option)}
          >
            {currentQuestion.multiSelect && (
              <View style={[
                styles.checkbox,
                !isDark && styles.lightCheckbox,
                selectedPreferences.includes(option) && styles.checkedBox
              ]}>
                {selectedPreferences.includes(option) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
            )}
            <Text style={[
              styles.optionText,
              !isDark && styles.lightOptionText,
              currentQuestion.multiSelect && selectedPreferences.includes(option) && styles.selectedOptionText
            ]}>{option}</Text>
          </TouchableOpacity>
        ))}

        {isLastQuestion && selectedPreferences.length > 0 && (
          <TouchableOpacity
            style={[styles.nextButton, !isDark && styles.lightNextButton]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Voir les activités</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }
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
    backgroundColor: '#FF3B7F',
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
    backgroundColor: '#FF3B7F',
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightCheckbox: {
    borderColor: '#999',
  },
  checkedBox: {
    backgroundColor: '#FF3B7F',
    borderColor: '#FF3B7F',
  },
  selectedOption: {
    backgroundColor: '#FF3B7F',
    borderColor: '#FF3B7F',
  },
  lightSelectedOption: {
    backgroundColor: '#FF3B7F',
    borderColor: '#FF3B7F',
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
  nextButton: {
    backgroundColor: '#FF3B7F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },
  lightNextButton: {
    backgroundColor: '#FF3B7F',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
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
    backgroundColor: '#FF3B7F',
    borderRadius: 2,
  }
});
