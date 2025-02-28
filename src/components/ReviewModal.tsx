import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { useTranslation } from '../hooks/useTranslation';
import RatingStars from './RatingStars';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
}

export default function ReviewModal({
  visible,
  onClose,
  onSubmit,
  initialRating = 0,
  initialComment = ''
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const { isDark } = useThemeStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      setRating(initialRating || 0);
      setComment(initialComment || '');
    }
  }, [visible, initialRating, initialComment]);

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert(
        'Note requise',
        'Veuillez attribuer une note avant de publier votre avis.'
      );
      return;
    }

    if (!comment.trim()) {
      Alert.alert(
        'Commentaire requis',
        'Veuillez ajouter un commentaire avant de publier votre avis.'
      );
      return;
    }

    try {
      onSubmit(rating, comment.trim());
      onClose();
      // Réinitialiser les champs après la soumission
      setRating(0);
      setComment('');
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la publication de votre avis. Veuillez réessayer.'
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.container, !isDark && styles.lightContainer]}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={[styles.title, !isDark && styles.lightTitle]}>
                Donnez votre avis
              </Text>
              <TouchableOpacity 
                onPress={onClose} 
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Text style={[styles.closeButtonText, !isDark && styles.lightCloseButtonText]}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ratingContainer}>
              <Text style={[styles.label, !isDark && styles.lightLabel]}>
                Votre note
              </Text>
              <RatingStars
                rating={rating}
                size={32}
                interactive={true}
                onRatingChange={(newRating) => setRating(newRating)}
              />
            </View>

            <View style={styles.commentContainer}>
              <Text style={[styles.label, !isDark && styles.lightLabel]}>
                Votre commentaire
              </Text>
              <TextInput
                style={[styles.input, !isDark && styles.lightInput]}
                value={comment}
                onChangeText={setComment}
                placeholder="Partagez votre expérience..."
                placeholderTextColor={isDark ? "#666" : "#999"}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, !isDark && styles.lightCancelButton]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, !isDark && styles.lightButtonText]}>
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  (!rating || !comment.trim()) && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={!rating || !comment.trim()}
                activeOpacity={0.7}
              >
                <Text style={styles.submitButtonText}>
                  Publier
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  lightCloseButtonText: {
    color: '#000',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '500',
  },
  lightLabel: {
    color: '#000',
  },
  commentContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    height: 120,
    fontSize: 16,
  },
  lightInput: {
    backgroundColor: '#f5f5f5',
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  lightCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#FF3B7F',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lightButtonText: {
    color: '#000',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});