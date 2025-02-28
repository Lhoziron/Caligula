import { Platform } from 'react-native';

/**
 * Vérifie si l'application s'exécute sur le web
 */
export const isWeb = Platform.OS === 'web';

/**
 * Vérifie si l'application s'exécute sur iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Vérifie si l'application s'exécute sur Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Vérifie si l'application s'exécute sur une plateforme native (iOS ou Android)
 */
export const isNative = isIOS || isAndroid;

/**
 * Fonction utilitaire pour exécuter du code spécifique à une plateforme
 * @param options Objet contenant les implémentations spécifiques à chaque plateforme
 * @returns Le résultat de l'implémentation pour la plateforme actuelle
 */
export function platformSpecific<T>(options: {
  web?: () => T;
  ios?: () => T;
  android?: () => T;
  native?: () => T;
  default?: () => T;
}): T | undefined {
  if (isWeb && options.web) {
    return options.web();
  }
  
  if (isIOS && options.ios) {
    return options.ios();
  }
  
  if (isAndroid && options.android) {
    return options.android();
  }
  
  if (isNative && options.native) {
    return options.native();
  }
  
  if (options.default) {
    return options.default();
  }
  
  return undefined;
}

/**
 * Fonction utilitaire pour obtenir une valeur spécifique à une plateforme
 * @param options Objet contenant les valeurs spécifiques à chaque plateforme
 * @returns La valeur pour la plateforme actuelle
 */
export function platformValue<T>(options: {
  web?: T;
  ios?: T;
  android?: T;
  native?: T;
  default?: T;
}): T | undefined {
  if (isWeb && options.web !== undefined) {
    return options.web;
  }
  
  if (isIOS && options.ios !== undefined) {
    return options.ios;
  }
  
  if (isAndroid && options.android !== undefined) {
    return options.android;
  }
  
  if (isNative && options.native !== undefined) {
    return options.native;
  }
  
  if (options.default !== undefined) {
    return options.default;
  }
  
  return undefined;
}