import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types/activity';
import { useThemeStore } from '../store/themeStore';

interface ActivityListProps {
  activities: Activity[];
  emptyMessage?: string;
}

export default function ActivityList({ activities, emptyMessage = "Aucune activité trouvée" }: ActivityListProps) {
  const { isDark } = useThemeStore();

  if (!activities || activities.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="search" size={64} color={isDark ? "#666" : "#999"} />
        <Text style={[styles.emptyStateTitle, !isDark && styles.lightEmptyStateTitle]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  const handleActivityPress = (id: number) => {
    router.push(`/activity/${id}`);
  };

  const renderActivity = ({ item, index }: { item: Activity; index: number }) => (
    <TouchableOpacity 
      style={[styles.card, !isDark && styles.lightCard]}
      onPress={() => handleActivityPress(item.id)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, !isDark && styles.lightCardTitle]}>
          {item.title}
        </Text>
        <Text style={[styles.cardDescription, !isDark && styles.lightCardDescription]}>
          {item.description}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={16} color={isDark ? "#666" : "#999"} />
            <Text style={[styles.detailText, !isDark && styles.lightDetailText]}>
              💰 {item.price}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={isDark ? "#666" : "#999"} />
            <Text style={[styles.detailText, !isDark && styles.lightDetailText]}>
              ⏱ {item.duration}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={isDark ? "#666" : "#999"} />
            <Text style={[styles.detailText, !isDark && styles.lightDetailText]}>
              📍 {item.city}{item.country ? `, ${item.country}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.tags}>
          {Array.isArray(item.tags) && item.tags.map((tag, tagIndex) => (
            tag && (
              <View 
                key={`tag-${tagIndex}-${item.id}`} 
                style={[styles.tag, !isDark && styles.lightTag]}
              >
                <Text style={[styles.tagText, !isDark && styles.lightTagText]}>#{tag}</Text>
              </View>
            )
          ))}
        </View>

        <Text style={[styles.transport, !isDark && styles.lightTransport]}>
          {item.transport}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={activities}
      renderItem={renderActivity}
      keyExtractor={(item, index) => `activity-${item.id}-${index}`}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  lightEmptyStateTitle: {
    color: '#000',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  lightCard: {
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
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  lightCardTitle: {
    color: '#000',
  },
  cardDescription: {
    fontSize: 16,
    color: '#999',
    marginBottom: 15,
  },
  lightCardDescription: {
    color: '#666',
  },
  details: {
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
    color: '#666',
    fontSize: 14,
  },
  lightDetailText: {
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  lightTag: {
    backgroundColor: '#f0f0f0',
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
  lightTagText: {
    color: '#666',
  },
  transport: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  lightTransport: {
    color: '#999',
  },
});