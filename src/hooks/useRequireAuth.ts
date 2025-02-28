import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);

  return isAuthenticated;
}
