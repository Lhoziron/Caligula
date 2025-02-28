import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
  id: string;
  activityId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsState {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getReviewsByActivityId: (activityId: number) => Review[];
  getUserReviewForActivity: (activityId: number, userId: string) => Review | undefined;
  getAverageRating: (activityId: number) => number;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],
      
      addReview: (review) => {
        const newReview = {
          ...review,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };

        set((state) => {
          // Filtrer les reviews existantes pour le même utilisateur et la même activité
          const filteredReviews = state.reviews.filter(
            r => !(r.activityId === review.activityId && r.userId === review.userId)
          );
          
          return {
            reviews: [...filteredReviews, newReview]
          };
        });
      },

      getReviewsByActivityId: (activityId) => {
        return get().reviews
          .filter(review => review.activityId === activityId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getUserReviewForActivity: (activityId, userId) => {
        return get().reviews.find(
          review => review.activityId === activityId && review.userId === userId
        );
      },

      getAverageRating: (activityId) => {
        const activityReviews = get().reviews.filter(
          review => review.activityId === activityId
        );
        
        if (activityReviews.length === 0) return 0;
        
        const sum = activityReviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / activityReviews.length;
      }
    }),
    {
      name: 'reviews-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);