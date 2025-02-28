import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types/activity';
import { useThemeStore } from '../store/themeStore';

interface ActivityMapProps {
  activities: Activity[];
  onClose: () => void;
}

export default function ActivityMap({ activities, onClose }: ActivityMapProps) {
  const { isDark } = useThemeStore();

  return (
    <View style={[styles.container, !isDark && styles.lightContainer]}>
      <Text style={[styles.webMessage, !isDark && styles.lightWebMessage]}>
        La carte n'est pas disponible sur le web. Veuillez utiliser l'application mobile.
      </Text>
      <TouchableOpacity 
        style={[styles.closeButton, !isDark && styles.lightCloseButton]} 
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  webMessage: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
  lightWebMessage: {
    color: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
});