import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingStarsProps {
  rating: number;
  size?: number;
  color?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

export default function RatingStars({
  rating,
  size = 20,
  color = '#FFD700',
  interactive = false,
  onRatingChange,
  readOnly = false
}: RatingStarsProps) {
  // S'assurer que le rating est un nombre valide
  const safeRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
  
  const handlePress = (selectedRating: number) => {
    if (interactive && onRatingChange && !readOnly) {
      // Si on clique sur la même étoile déjà sélectionnée, on peut la désélectionner
      if (selectedRating === safeRating) {
        onRatingChange(0);
      } else {
        onRatingChange(selectedRating);
      }
    }
  };

  const renderStar = (index: number) => {
    const starFilled = index + 1 <= safeRating;
    const starHalf = !starFilled && index + 0.5 <= safeRating;

    const Star = () => (
      <Ionicons
        name={starFilled ? 'star' : (starHalf ? 'star-half' : 'star-outline')}
        size={size}
        color={color}
      />
    );

    if (interactive && !readOnly) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(index + 1)}
          style={styles.starButton}
          activeOpacity={0.7}
        >
          <Star />
        </TouchableOpacity>
      );
    }

    return (
      <View key={index} style={styles.star}>
        <Star />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    padding: 2,
  },
  starButton: {
    padding: 2,
  },
});