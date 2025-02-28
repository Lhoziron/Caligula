import { useLanguageStore } from '../store/languageStore';
import fr from '../../locales/fr.json';
import en from '../../locales/en.json';

export function useTranslation() {
  const { language } = useLanguageStore();
  const translations = language === 'fr' ? fr : en;

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }
    
    return value;
  };

  return { t, language };
}