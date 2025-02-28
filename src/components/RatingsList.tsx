import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { useRatingsStore } from '../store/ratingsStore';
import RatingStars from './RatingStars';

interface RatingsListProps {
  activityId: number;
}

export default function RatingsList({ activityId }: RatingsListProps) {
  const { isDark } = useThemeStore();
  const { getActivityRatings, getAverageRating, getRatingsCount } = useRatingsStore();

  const ratings = getActivityRatings(activityId);
  const averageRating = getAverageRating(activityId);
  const ratingsCount = getRatingsCount(activityId);

  if (ratingsCount === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, !isDark && styles.lightEmptyText]}>
          Soyez le premier à donner votre avis !
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.averageContainer}>
          <Text style={[styles.averageRating, !isDark && styles.lightAverageRating]}>
            {averageRating.toFixed(1)}
          </Text>
          <RatingStars rating={averageRating} size={24} />
          <Text style={[styles.ratingsCount, !isDark && styles.lightRatingsCount]}>
            {ratingsCount} avis
          </Text>
        </View>
      </View>

      <ScrollView style={styles.ratingsList}>
        {ratings.map((rating) => (
          <View key={rating.id} style={[styles.ratingItem, !isDark && styles.lightRatingItem]}>
            <View style={styles.ratingHeader}>
              <Text style={[styles.userName, !isDark && styles.lightUserName]}>
                Utilisateur
              </Text>
              <Text style={[styles.date, !isDark && styles.lightDate]}>
                {new Date(rating.updatedAt).toLocaleDateString()}
              </Text>
            </View>
            <RatingStars rating={rating.rating} size={16} />
            <Text style={[styles.comment, !isDark && styles.lightComment]}>
              {rating.comment}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  averageContainer: {
    alignItems: 'center',
    gap: 8,
  },
  averageRating: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  lightAverageRating: {
    color: '#000',
  },
  ratingsCount: {
    color: '#666',
    fontSize: 14,
  },
  lightRatingsCount: {
    color: '#999',
  },
  ratingsList: {
    flex: 1,
  },
  ratingItem: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  lightRatingItem: {
    backgroundColor: '#f5f5f5',
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  lightUserName: {
    color: '#000',
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  lightDate: {
    color: '#999',
  },
  comment: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  lightComment: {
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  lightEmptyText: {
    color: '#999',
  },
});