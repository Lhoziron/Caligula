import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useAuthStore } from './authStore';

export interface Rating {
  id: string;
  userId: string;
  activityId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface RatingsState {
  ratings: Rating[];
  addRating: (activityId: number, rating: number, comment: string) => void;
  updateRating: (ratingId: string, rating: number, comment: string) => void;
  getUserRating: (activityId: number) => Rating | undefined;
  getActivityRatings: (activityId: number) => Rating[];
  getAverageRating: (activityId: number) => number;
  getRatingsCount: (activityId: number) => number;
}

export const useRatingsStore = create<RatingsState>()(
  persist(
    (set, get) => ({
      ratings: [],

      addRating: (activityId, rating, comment) => {
        const { isAuthenticated, currentUser } = useAuthStore.getState();
        
        if (!isAuthenticated || !currentUser) {
          Alert.alert(
            'Connexion requise',
            'Vous devez être connecté pour noter une activité.',
            [{ text: 'OK' }]
          );
          return;
        }

        if (rating < 1 || rating > 5) {
          Alert.alert('Erreur', 'La note doit être comprise entre 1 et 5 étoiles.');
          return;
        }

        // Vérifier si l'utilisateur a déjà noté cette activité
        const existingRating = get().ratings.find(
          r => r.userId === currentUser.id && r.activityId === activityId
        );

        if (existingRating) {
          get().updateRating(existingRating.id, rating, comment);
          return;
        }

        const newRating: Rating = {
          id: Date.now().toString(),
          userId: currentUser.id,
          activityId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          ratings: [...state.ratings, newRating]
        }));
      },

      updateRating: (ratingId, rating, comment) => {
        const { isAuthenticated, currentUser } = useAuthStore.getState();
        
        if (!isAuthenticated || !currentUser) return;

        if (rating < 1 || rating > 5) {
          Alert.alert('Erreur', 'La note doit être comprise entre 1 et 5 étoiles.');
          return;
        }

        set(state => ({
          ratings: state.ratings.map(r => 
            r.id === ratingId
              ? {
                  ...r,
                  rating,
                  comment,
                  updatedAt: new Date().toISOString()
                }
              : r
          )
        }));
      },

      getUserRating: (activityId) => {
        const { isAuthenticated, currentUser } = useAuthStore.getState();
        if (!isAuthenticated || !currentUser) return undefined;

        return get().ratings.find(
          r => r.userId === currentUser.id && r.activityId === activityId
        );
      },

      getActivityRatings: (activityId) => {
        return get().ratings
          .filter(r => r.activityId === activityId)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getAverageRating: (activityId) => {
        const ratings = get().ratings.filter(r => r.activityId === activityId);
        if (ratings.length === 0) return 0;
        
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        return Math.round((sum / ratings.length) * 10) / 10;
      },

      getRatingsCount: (activityId) => {
        return get().ratings.filter(r => r.activityId === activityId).length;
      }
    }),
    {
      name: 'ratings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);