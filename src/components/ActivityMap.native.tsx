import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, Animated, PanResponder, Dimensions } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Activity } from '../types/activity';
import { calculateDistance, formatDistance } from '../utils/distance';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import MapView, { Marker, Callout } from 'react-native-maps';

interface ActivityMapProps {
  activities: Activity[];
  onClose: () => void;
}

// Types d'activités pour les marqueurs colorés
type MarkerType = 'nature' | 'culture' | 'food' | 'adventure' | 'shopping' | 'default';

export default function ActivityMap({ activities, onClose }: ActivityMapProps) {
  const { isDark } = useThemeStore();
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const slideAnim = new Animated.Value(0);
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      setIsDragging(false);
      if (gestureState.dy > 100) {
        closeActivityCard();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        console.warn('Erreur lors de la récupération de la position:', error);
      }
    })();
  }, []);

  const handleSeeMore = (activity: Activity) => {
    onClose();
    router.push(`/activity/${activity.id}`);
  };

  const closeActivityCard = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedActivity(null);
      slideAnim.setValue(0);
    });
  };

  const getMarkerTitle = (title: string) => {
    if (!title) return '📍';
    const firstEmoji = title.match(/[\u{1F300}-\u{1F9FF}]/u)?.[0];
    return firstEmoji || title.split(' ')[0] || '📍';
  };

  // Déterminer le type de marqueur en fonction des tags et du titre
  const getMarkerType = (activity: Activity): MarkerType => {
    if (!activity || !activity.tags || !activity.title) return 'default';
    
    // Vérifier que les tags existent et sont un tableau
    const tags = Array.isArray(activity.tags) 
      ? activity.tags.map(tag => (tag || '').toLowerCase())
      : [];
    
    const title = (activity.title || '').toLowerCase();
    
    if (tags.some(tag => ['nature', 'parc', 'jardin', 'forêt', 'montagne', 'plage', 'lac'].includes(tag)) || 
        title.includes('parc') || title.includes('jardin') || title.includes('nature')) {
      return 'nature';
    }
    
    if (tags.some(tag => ['musée', 'culture', 'art', 'histoire', 'monument', 'patrimoine'].includes(tag)) || 
        title.includes('musée') || title.includes('galerie') || title.includes('monument')) {
      return 'culture';
    }
    
    if (tags.some(tag => ['restaurant', 'gastronomie', 'cuisine', 'café', 'bar'].includes(tag)) || 
        title.includes('restaurant') || title.includes('café') || title.includes('gastronomie')) {
      return 'food';
    }
    
    if (tags.some(tag => ['aventure', 'sport', 'activité', 'randonnée', 'escalade'].includes(tag)) || 
        title.includes('aventure') || title.includes('sport')) {
      return 'adventure';
    }
    
    if (tags.some(tag => ['shopping', 'boutique', 'marché', 'magasin'].includes(tag)) || 
        title.includes('shopping') || title.includes('boutique') || title.includes('marché')) {
      return 'shopping';
    }
    
    return 'default';
  };

  // Obtenir la couleur du marqueur en fonction du type
  const getMarkerColor = (type: MarkerType): string => {
    switch (type) {
      case 'nature':
        return '#4CAF50'; // Vert
      case 'culture':
        return '#FFFFFF'; // Blanc
      case 'food':
        return '#FF9800'; // Orange
      case 'adventure':
        return '#2196F3'; // Bleu
      case 'shopping':
        return '#E91E63'; // Rose
      default:
        return '#FF3B7F'; // Rose par défaut
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        {Array.isArray(activities) && activities.map((activity) => {
          if (!activity || !activity.coordinates) return null;
          
          const markerType = getMarkerType(activity);
          const markerColor = getMarkerColor(markerType);
          
          return (
            <Marker
              key={activity.id}
              coordinate={{
                latitude: activity.coordinates.latitude,
                longitude: activity.coordinates.longitude,
              }}
              onPress={() => {
                slideAnim.setValue(0);
                setSelectedActivity(activity);
              }}
            >
              <View style={styles.markerContainer}>
                <View style={[styles.markerBubble, { backgroundColor: markerColor }]}>
                  <Text style={[
                    styles.markerEmoji, 
                    markerType === 'culture' ? { color: '#000' } : { color: '#fff' }
                  ]}>
                    {getMarkerTitle(activity.title || '')}
                  </Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity 
        style={[styles.closeButton, !isDark && styles.lightCloseButton]} 
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>

      {/* Légende des marqueurs */}
      <View style={[styles.legendContainer, !isDark && styles.lightLegendContainer]}>
        <Text style={[styles.legendTitle, !isDark && styles.lightLegendTitle]}>
          Types de lieux
        </Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: getMarkerColor('nature') }]} />
          <Text style={[styles.legendText, !isDark && styles.lightLegendText]}>Parcs et nature</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: getMarkerColor('culture') }]} />
          <Text style={[styles.legendText, !isDark && styles.lightLegendText]}>Sites culturels et musées</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: getMarkerColor('food') }]} />
          <Text style={[styles.legendText, !isDark && styles.lightLegendText]}>Restaurants et gastronomie</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: getMarkerColor('adventure') }]} />
          <Text style={[styles.legendText, !isDark && styles.lightLegendText]}>Sports et aventures</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: getMarkerColor('shopping') }]} />
          <Text style={[styles.legendText, !isDark && styles.lightLegendText]}>Shopping et marchés</Text>
        </View>
      </View>

      {selectedActivity && (
        <Animated.View
          style={[
            styles.activityCard,
            !isDark && styles.lightActivityCard,
            {
              transform: [{ translateY: slideAnim }],
              opacity: slideAnim.interpolate({
                inputRange: [0, 200],
                outputRange: [1, 0],
              }),
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragIndicator} />
          
          <Image
            source={{ uri: selectedActivity.image }}
            style={styles.activityImage}
          />
          
          <View style={styles.cardContent}>
            <Text style={[styles.activityTitle, !isDark && styles.lightActivityTitle]}>
              {selectedActivity.title}
            </Text>
            
            <Text style={[styles.activityDescription, !isDark && styles.lightActivityDescription]}>
              {selectedActivity.description}
            </Text>
            
            <View style={styles.activityDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={16} color={isDark ? "#999" : "#666"} />
                <Text style={[styles.detailText, !isDark && styles.lightDetailText]}>
                  {selectedActivity.price}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color={isDark ? "#999" : "#666"} />
                <Text style={[styles.detailText, !isDark && styles.lightDetailText]}>
                  {selectedActivity.duration}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={16} color={isDark ? "#999" : "#666"} />
                <Text style={[styles.detailText, !isDark && styles.lightDetailText]}>
                  {selectedActivity.city}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.seeMoreButton}
              onPress={() => handleSeeMore(selectedActivity)}
            >
              <Text style={styles.seeMoreText}>Voir plus</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    backgroundColor: '#FF3B7F',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerEmoji: {
    fontSize: 16,
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  lightCloseButton: {
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
  legendContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 90,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 10,
    zIndex: 900,
    width: 200,
  },
  lightLegendContainer: {
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
  legendTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lightLegendTitle: {
    color: '#000',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
  },
  lightLegendText: {
    color: '#000',
  },
  activityCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  lightActivityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  activityImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 15,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lightActivityTitle: {
    color: '#000',
  },
  activityDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 10,
  },
  lightActivityDescription: {
    color: '#666',
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    color: '#999',
    fontSize: 14,
  },
  lightDetailText: {
    color: '#666',
  },
  seeMoreButton: {
    backgroundColor: '#FF3B7F',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  seeMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});