import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useLocationStore } from '../store/locationStore';

/**
 * Hook pour protéger les routes qui nécessitent une authentification
 * @param redirectTo Route de redirection si l'utilisateur n'est pas authentifié
 */
export function useAuthGuard(redirectTo = '/auth/login') {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo]);
}

/**
 * Hook pour vérifier si l'utilisateur a sélectionné un pays et une ville
 */
export function useLocationCheck() {
  const { selectedCountry, selectedCity } = useLocationStore();
  
  return {
    hasLocation: !!selectedCountry && !!selectedCity,
    selectedCountry,
    selectedCity
  };
}