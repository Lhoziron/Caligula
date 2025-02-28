import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useAuthStore } from './authStore';

interface FavoritesState {
  favorites: { [userId: string]: number[] };
  addFavorite: (activityId: number) => void;
  removeFavorite: (activityId: number) => void;
  isFavorite: (activityId: number) => boolean;
  getFavorites: () => number[];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},

      addFavorite: (activityId) => {
        const { isAuthenticated, currentUser } = useAuthStore.getState();
        
        if (!isAuthenticated || !currentUser) {
          Alert.alert(
            'Connexion requise',
            'Vous devez être connecté pour ajouter des favoris.',
            [
              { text: 'OK' }
            ]
          );
          return;
        }

        set((state) => {
          const userFavorites = state.favorites[currentUser.id] || [];
          if (!userFavorites.includes(activityId)) {
            return {
              favorites: {
                ...state.favorites,
                [currentUser.id]: [...userFavorites, activityId]
              }
            };
          }
          return state;
        });
      },

      removeFavorite: (activityId) => {
        const { isAuthenticated, currentUser } = useAuthStore.getState();
        
        if (!isAuthenticated || !currentUser) {
          return;
        }

        set((state) => {
          const userFavorites = state.favorites[currentUser.id] || [];
          return {
            favorites: {
              ...state.favorites,
              [currentUser.id]: userFavorites.filter(id => id !== activityId)
            }
          };
        });
      },

      isFavorite: (activityId) => {
        const { isAuthenticated, currentUser } = useAuthStore.getState();
        if (!isAuthenticated || !currentUser) return false;
        
        const state = get();
        const userFavorites = state.favorites[currentUser.id] || [];
        return userFavorites.includes(activityId);
      },

      getFavorites: () => {
        const { isAuthenticated, currentUser } = useAuthStore.getState();
        if (!isAuthenticated || !currentUser) return [];
        
        const state = get();
        return state.favorites[currentUser.id] || [];
      }
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);