import AsyncStorage from '@react-native-async-storage/async-storage';
import { platformSpecific, isWeb } from './platformUtils';

/**
 * Interface pour les opérations de stockage
 */
export interface StorageInterface {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

/**
 * Implémentation du stockage pour le web
 */
const webStorage: StorageInterface = {
  getItem: async (key: string) => {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  
  setItem: async (key: string, value: string) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  },
  
  removeItem: async (key: string) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  },
  
  clear: async () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

/**
 * Implémentation du stockage pour les plateformes natives
 */
const nativeStorage: StorageInterface = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting AsyncStorage item:', error);
      return null;
    }
  },
  
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting AsyncStorage item:', error);
    }
  },
  
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing AsyncStorage item:', error);
    }
  },
  
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }
};

/**
 * Stockage unifié qui utilise l'implémentation appropriée selon la plateforme
 */
export const storage: StorageInterface = isWeb ? webStorage : nativeStorage;

/**
 * Stocke un objet dans le stockage
 * @param key Clé de stockage
 * @param value Objet à stocker
 */
export async function storeObject<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await storage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing object:', error);
  }
}

/**
 * Récupère un objet du stockage
 * @param key Clé de stockage
 * @returns L'objet stocké ou null si non trouvé
 */
export async function getObject<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await storage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) as T : null;
  } catch (error) {
    console.error('Error retrieving object:', error);
    return null;
  }
}