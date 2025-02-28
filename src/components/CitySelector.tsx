import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useLocationStore } from '../store/locationStore';
import { getCitiesForCountry, validateCountryCity } from '../utils/cityMapping';

interface CitySelectorProps {
  onCitySelected: (city: string) => void;
}

export default function CitySelector({ onCitySelected }: CitySelectorProps) {
  const { isDark } = useThemeStore();
  const { selectedCountry, selectedCity, setSelectedCity } = useLocationStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Mettre à jour la liste des villes lorsque le pays change
  useEffect(() => {
    try {
      if (selectedCountry) {
        const cities = getCitiesForCountry(selectedCountry);
        setAvailableCities(Array.isArray(cities) ? cities : []);
        
        // Vérifier si la ville actuellement sélectionnée est valide pour le nouveau pays
        if (selectedCity) {
          const validation = validateCountryCity(selectedCountry, selectedCity);
          if (!validation.valid) {
            Alert.alert(
              "Incohérence détectée",
              validation.message,
              [
                { text: "OK", onPress: () => setSelectedCity(null) }
              ]
            );
          }
        }
      } else {
        setAvailableCities([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des villes:', error);
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  const handleCitySelect = (city: string) => {
    try {
      setSelectedCity(city);
      onCitySelected(city);
      setModalVisible(false);
    } catch (error) {
      console.error('Erreur lors de la sélection de la ville:', error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sélection de la ville. Veuillez réessayer."
      );
    }
  };

  // Si aucun pays n'est sélectionné, ne pas afficher le sélecteur de ville
  if (!selectedCountry) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.selector, !isDark && styles.lightSelector]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[
          styles.selectorText,
          !isDark && styles.lightSelectorText,
          !selectedCity && styles.placeholderText
        ]}>
          {selectedCity || "Sélectionner une ville"}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={isDark ? "#fff" : "#000"} 
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, !isDark && styles.lightModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, !isDark && styles.lightModalTitle]}>
                Villes en {selectedCountry}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={isDark ? "#fff" : "#000"} />
              </TouchableOpacity>
            </View>

            {availableCities.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="location-outline" size={48} color={isDark ? "#666" : "#999"} />
                <Text style={[styles.emptyText, !isDark && styles.lightEmptyText]}>
                  Aucune ville disponible pour ce pays
                </Text>
              </View>
            ) : (
              <FlatList
                data={availableCities}
                keyExtractor={(item, index) => `city-${item}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.cityItem,
                      !isDark && styles.lightCityItem,
                      selectedCity === item && styles.selectedCityItem
                    ]}
                    onPress={() => handleCitySelect(item)}
                  >
                    <Text style={[
                      styles.cityText,
                      !isDark && styles.lightCityText,
                      selectedCity === item && styles.selectedCityText
                    ]}>
                      {item}
                    </Text>
                    {selectedCity === item && (
                      <Ionicons name="checkmark" size={20} color="#FF3B7F" />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  lightSelector: {
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
  selectorText: {
    color: '#fff',
    fontSize: 16,
  },
  lightSelectorText: {
    color: '#000',
  },
  placeholderText: {
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  lightModalContent: {
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  lightModalTitle: {
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  lightCityItem: {
    borderBottomColor: '#e0e0e0',
  },
  selectedCityItem: {
    backgroundColor: 'rgba(255, 59, 127, 0.1)',
  },
  cityText: {
    color: '#fff',
    fontSize: 16,
  },
  lightCityText: {
    color: '#000',
  },
  selectedCityText: {
    color: '#FF3B7F',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  lightEmptyText: {
    color: '#999',
  },
});