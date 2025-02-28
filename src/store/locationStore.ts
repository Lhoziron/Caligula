import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../utils/storage';

interface LocationState {
  selectedCountry: string | null;
  selectedCity: string | null;
  showCountryPicker: boolean;
  showCityPicker: boolean;
  setSelectedCountry: (country: string | null) => void;
  setSelectedCity: (city: string | null) => void;
  setShowCountryPicker: (show: boolean) => void;
  setShowCityPicker: (show: boolean) => void;
  resetFilters: () => void;
}

// Créer un middleware de persistance personnalisé qui utilise notre utilitaire de stockage
const customPersistMiddleware = persist<LocationState>(
  (set) => ({
    selectedCountry: null,
    selectedCity: null,
    showCountryPicker: false,
    showCityPicker: false,
    setSelectedCountry: (country) => set({ 
      selectedCountry: country,
      selectedCity: null,
      showCountryPicker: false
    }),
    setSelectedCity: (city) => set({ 
      selectedCity: city,
      showCityPicker: false
    }),
    setShowCountryPicker: (show) => set({ showCountryPicker: show }),
    setShowCityPicker: (show) => set({ showCityPicker: show }),
    resetFilters: () => set({ 
      selectedCountry: null,
      selectedCity: null,
      showCountryPicker: false,
      showCityPicker: false
    }),
  }),
  {
    name: 'location-storage',
    storage: {
      getItem: async (name) => {
        const value = await storage.getItem(name);
        return value ? JSON.parse(value) : null;
      },
      setItem: async (name, value) => {
        await storage.setItem(name, JSON.stringify(value));
      },      
      removeItem: async (name) => {
        await storage.removeItem(name);
      },
    },
  }
);

export const useLocationStore = create<LocationState>()(customPersistMiddleware);