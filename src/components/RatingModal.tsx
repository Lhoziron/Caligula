import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { useRatingsStore, Rating } from '../store/ratingsStore';
import RatingStars from './RatingStars';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  activityId: number;
  initialRating?: Rating;
}

export default function RatingModal({
  visible,
  onClose,
  activityId,
  initialRating
}: RatingModalProps) {
  const [rating, setRating] = useState(initialRating?.rating || 0);
  const [comment, setComment] = useState(initialRating?.comment || '');
  const { isDark } = useThemeStore();
  const { addRating, updateRating } = useRatingsStore();

  useEffect(() => {
    if (visible) {
      setRating(initialRating?.rating || 0);
      setComment(initialRating?.comment || '');
    }
  }, [visible, initialRating]);

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Note requise', 'Veuillez attribuer une note avant de publier votre avis.');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Commentaire requis', 'Veuillez ajouter un commentaire avant de publier votre avis.');
      return;
    }

    try {
      if (initialRating) {
        updateRating(initialRating.id, rating, comment.trim());
      } else {
        addRating(activityId, rating, comment.trim());
      }
      onClose();
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
          <View style={styles.header}>
            <Text style={[styles.title, !isDark && styles.lightTitle]}>
              {initialRating ? 'Modifier votre avis' : 'Donner votre avis'}
            </Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
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
              onRatingChange={setRating}
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
            >
              <Text style={styles.submitButtonText}>
                {initialRating ? 'Mettre à jour' : 'Publier'}
              </Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  lightContainer: {
    backgroundColor: '#fff',
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