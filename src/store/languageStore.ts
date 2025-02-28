import { create } from 'zustand';

interface LanguageState {
  language: 'fr' | 'en';
  setLanguage: (language: 'fr' | 'en') => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'fr',
  setLanguage: (language) => set({ language }),
}));