import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { activities } from '../../src/data/activities';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { calculateDistance, formatDistance } from '../../src/utils/distance';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useReviewsStore } from '../../src/store/reviewsStore';
import { LinearGradient } from 'expo-linear-gradient';
import RatingStars from '../../src/components/RatingStars';
import ReviewModal from '../../src/components/ReviewModal';

export default function ActivityDetails() {
  const { id } = useLocalSearchParams();
  const activity = activities.find(a => a.id === parseInt(id as string));
  const [distance, setDistance] = useState<string | null>(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { isDark } = useThemeStore();
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useTranslation();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const {
    reviews,
    addReview,
    getReviewsByActivityId,
    getUserReviewForActivity,
    getAverageRating
  } = useReviewsStore();

  const activityReviews = activity ? getReviewsByActivityId(activity.id) : [];
  const averageRating = activity ? getAverageRating(activity.id) : 0;
  const userReview = activity && user ? getUserReviewForActivity(activity.id, user.id) : undefined;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted' && activity?.coordinates) {
          const location = await Location.getCurrentPositionAsync({});
          const calculatedDistance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            activity.coordinates.latitude,
            activity.coordinates.longitude
          );
          setDistance(formatDistance(calculatedDistance));
        }
      } catch (err) {
        console.warn('Erreur lors de la récupération de la position:', err);
      }
    })();
  }, [activity]);

  const handleFavoritePress = () => {
    if (!isAuthenticated) {
      Alert.alert(
        t('auth.required.title'),
        t('auth.required.message'),
        [
          {
            text: t('auth.required.cancel'),
            style: 'cancel'
          },
          {
            text: t('auth.required.login'),
            onPress: () => router.push('/auth/login')
          }
        ]
      );
      return;
    }

    if (activity) {
      if (isFavorite(activity.id)) {
        removeFavorite(activity.id);
      } else {
        addFavorite(activity.id);
      }
    }
  };

  const handleReviewPress = () => {
    if (!isAuthenticated) {
      Alert.alert(
        t('auth.required.title'),
        t('auth.required.message'),
        [
          {
            text: t('auth.required.cancel'),
            style: 'cancel'
          },
          {
            text: t('auth.required.login'),
            onPress: () => router.push('/auth/login')
          }
        ]
      );
      return;
    }

    setShowReviewModal(true);
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!activity || !user) return;

    addReview({
      activityId: activity.id,
      userId: user.id,
      userName: user.firstName,
      rating,
      comment
    });
  };

  const openMaps = () => {
    if (!activity) return;
    
    const { address, title } = activity;
    const encodedAddress = encodeURIComponent(address);
    const encodedTitle = encodeURIComponent(title);
    
    const appleMapsUrl = `maps://maps.apple.com/?q=${encodedAddress}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    if (Platform.OS === 'ios') {
      Linking.openURL(appleMapsUrl).catch(() => {
        Linking.openURL(googleMapsUrl);
      });
    } else {
      Linking.openURL(googleMapsUrl);
    }
  };

  if (!activity) {
    return (
      <View style={[styles.container, !isDark && styles.lightContainer]}>
        <LinearGradient
          colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
          style={styles.background}
        />
        <TouchableOpacity 
          style={[styles.backButton, !isDark && styles.lightBackButton]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={isDark ? "#666" : "#999"} />
          <Text style={[styles.errorText, !isDark && styles.lightErrorText]}>
            Activité non trouvée
          </Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => router.push('/activities')}
          >
            <Text style={styles.returnButtonText}>Retour aux activités</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, !isDark && styles.lightContainer]}>
      <LinearGradient
        colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
        style={styles.background}
      />

      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={[styles.backButton, !isDark && styles.lightBackButton]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.favoriteButton, !isDark && styles.lightFavoriteButton]}
          onPress={handleFavoritePress}
        >
          <Ionicons 
            name={isFavorite(activity.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite(activity.id) ? "#FF3B7F" : (isDark ? "#fff" : "#000")} 
          />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: activity.image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={[styles.title, !isDark && styles.lightTitle]}>{activity.title}</Text>

        <View style={styles.ratingContainer}>
          <RatingStars rating={averageRating} size={20} />
          <Text style={[styles.ratingText, !isDark && styles.lightRatingText]}>
            {averageRating.toFixed(1)} ({activityReviews.length} avis)
          </Text>
        </View>

        <Text style={[styles.description, !isDark && styles.lightDescription]}>
          {activity.description}
        </Text>

        <View style={[styles.infoSection, !isDark && styles.lightInfoSection]}>
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color="#FF3B7F" />
            <Text style={[styles.infoText, !isDark && styles.lightInfoText]}>
              Prix: {activity.price}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#FF3B7F" />
            <Text style={[styles.infoText, !isDark && styles.lightInfoText]}>
              Durée: {activity.duration}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#FF3B7F" />
            <Text style={[styles.infoText, !isDark && styles.lightInfoText]}>
              Distance: {distance || 'Calcul en cours...'}
            </Text>
          </View>

          <TouchableOpacity style={styles.addressRow} onPress={openMaps}>
            <Ionicons name="map-outline" size={20} color="#FF3B7F" />
            <Text style={[styles.infoText, styles.addressText, !isDark && styles.lightInfoText]}>
              {activity.address}
            </Text>
            <Ionicons name="open-outline" size={16} color={isDark ? "#666" : "#999"} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>
              {Platform.OS === 'ios' ? "Ouvrir dans Plans 🗺️" : "Voir sur Google Maps 🗺️"}
            </Text>
          </TouchableOpacity>

          <View style={styles.transportSection}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
              Comment s'y rendre 🚇
            </Text>
            <Text style={[styles.transportText, !isDark && styles.lightTransportText]}>
              {activity.transport}
            </Text>
            <Text style={[styles.transportDetails, !isDark && styles.lightTransportDetails]}>
              {activity.transportDetails}
            </Text>
          </View>

          <View style={styles.hoursSection}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
              Horaires d'ouverture ⏰
            </Text>
            {activity.openingHours.map((hours, index) => (
              <Text key={index} style={[styles.hoursText, !isDark && styles.lightHoursText]}>
                {hours}
              </Text>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.bookingButton}
            onPress={() => Linking.openURL(activity.bookingUrl)}
          >
            <Text style={styles.bookingButtonText}>Réserver maintenant 🎟</Text>
          </TouchableOpacity>

          <View style={styles.reviewsSection}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
              Avis des visiteurs 📝
            </Text>

            <TouchableOpacity
              style={[styles.addReviewButton, !isDark && styles.lightAddReviewButton]}
              onPress={handleReviewPress}
            >
              <Ionicons name="create-outline" size={20} color={isDark ? "#fff" : "#000"} />
              <Text style={[styles.addReviewButtonText, !isDark && styles.lightAddReviewButtonText]}>
                {userReview ? "Modifier mon avis" : "Donner mon avis"}
              </Text>
            </TouchableOpacity>

            {activityReviews.length > 0 ? (
              activityReviews.map((review) => (
                <View key={review.id} style={[styles.reviewCard, !isDark && styles.lightReviewCard]}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewerName, !isDark && styles.lightReviewerName]}>
                      {review.userName}
                    </Text>
                    <RatingStars rating={review.rating} size={16} />
                  </View>
                  <Text style={[styles.reviewComment, !isDark && styles.lightReviewComment]}>
                    {review.comment}
                  </Text>
                  <Text style={[styles.reviewDate, !isDark && styles.lightReviewDate]}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[styles.noReviewsText, !isDark && styles.lightNoReviewsText]}>
                Soyez le premier à donner votre avis !
              </Text>
            )}
          </View>

          <View style={styles.tagsContainer}>
            {activity.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, !isDark && styles.lightTag]}>
                <Text style={[styles.tagText, !isDark && styles.lightTagText]}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
        initialRating={userReview?.rating}
        initialComment={userReview?.comment}
      />
    </ScrollView>
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
  headerButtons: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    padding: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
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
  favoriteButton: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightFavoriteButton: {
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  lightErrorText: {
    color: '#000',
  },
  returnButton: {
    backgroundColor: '#FF3B7F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  lightTitle: {
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  ratingText: {
    color: '#999',
    fontSize: 14,
  },
  lightRatingText: {
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    lineHeight: 24,
  },
  lightDescription: {
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    gap: 15,
  },
  lightInfoSection: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
  },
  lightInfoText: {
    color: '#000',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  addressText: {
    flex: 1,
    textDecorationLine: 'underline',
  },
  mapButton: {
    backgroundColor: '#FF3B7F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transportSection: {
    marginTop: 10,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  lightSectionTitle: {
    color: '#000',
  },
  transportText: {
    color: '#fff',
    fontSize: 16,
  },
  lightTransportText: {
    color: '#000',
  },
  transportDetails: {
    color: '#999',
    fontSize: 14,
  },
  lightTransportDetails: {
    color: '#666',
  },
  hoursSection: {
    marginTop: 20,
    gap: 8,
  },
  hoursText: {
    color: '#fff',
    fontSize: 14,
  },
  lightHoursText: {
    color: '#000',
  },
  bookingButton: {
    backgroundColor: '#FF3B7F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewsSection: {
    marginTop: 30,
    gap: 15,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  lightAddReviewButton: {
    backgroundColor: '#f0f0f0',
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  lightAddReviewButtonText: {
    color: '#000',
  },
  reviewCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  lightReviewCard: {
    backgroundColor: '#f5f5f5',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lightReviewerName: {
    color: '#000',
  },
  reviewComment: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  lightReviewComment: {
    color: '#666',
  },
  reviewDate: {
    color: '#666',
    fontSize: 12,
  },
  lightReviewDate: {
    color: '#999',
  },
  noReviewsText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  lightNoReviewsText: {
    color: '#999',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  tag: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  lightTag: {
    backgroundColor: '#f0f0f0',
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  lightTagText: {
    color: '#666',
  },
});
