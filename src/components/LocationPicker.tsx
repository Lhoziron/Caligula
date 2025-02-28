import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useTravelStore } from '../store/travelStore';
import { useLocationStore } from '../store/locationStore';

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  type: 'country' | 'city';
}

const CITIES: { [key: string]: string[] } = {
  'France': ['Paris', 'Marseille', 'Lyon', 'Bordeaux', 'Strasbourg', 'Nice'],
  'Japon': ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Sapporo', 'Nara'],
  'Canada': ['Montréal', 'Toronto', 'Vancouver', 'Québec', 'Ottawa', 'Calgary'],
  'Maroc': ['Marrakech', 'Casablanca', 'Fès', 'Rabat', 'Tanger', 'Agadir'],
  'Sénégal': ['Dakar', 'Saint-Louis', 'Thiès', 'Ziguinchor', 'Touba', 'Mbour'],
  "Côte d'Ivoire": ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San Pedro', 'Korhogo', 'Man']
};

export default function LocationPicker({ visible, onClose, type }: LocationPickerProps) {
  const { isDark } = useThemeStore();
  const { getSortedDestinations } = useTravelStore();
  const { selectedCountry, selectedCity, setSelectedCountry, setSelectedCity } = useLocationStore();

  const destinations = getSortedDestinations();
  const countries = destinations.map(dest => dest.name);
  const cities = selectedCountry && type === 'city' ? CITIES[selectedCountry] || [] : [];

  const handleSelect = (value: string) => {
    if (type === 'country') {
      setSelectedCountry(value);
    } else {
      setSelectedCity(value);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, !isDark && styles.lightContainer]}>
          <View style={styles.header}>
            <Text style={[styles.title, !isDark && styles.lightTitle]}>
              {type === 'country' ? 'Choisir un pays' : 'Choisir une ville'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {(type === 'country' ? countries : cities).map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.item,
                  !isDark && styles.lightItem,
                  ((type === 'country' && selectedCountry === item) ||
                   (type === 'city' && selectedCity === item)) &&
                    styles.selectedItem
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={[
                  styles.itemText,
                  !isDark && styles.lightItemText,
                  ((type === 'country' && selectedCountry === item) ||
                   (type === 'city' && selectedCity === item)) &&
                    styles.selectedItemText
                ]}>
                  {item}
                </Text>
                {((type === 'country' && selectedCountry === item) ||
                  (type === 'city' && selectedCity === item)) && (
                  <Ionicons name="checkmark" size={24} color="#FF3B7F" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
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
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
  content: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#333',
  },
  lightItem: {
    backgroundColor: '#f5f5f5',
  },
  selectedItem: {
    backgroundColor: 'rgba(255, 59, 127, 0.1)',
    borderWidth: 1,
    borderColor: '#FF3B7F',
  },
  itemText: {
    fontSize: 18,
    color: '#fff',
  },
  lightItemText: {
    color: '#000',
  },
  selectedItemText: {
    color: '#FF3B7F',
    fontWeight: 'bold',
  },
});