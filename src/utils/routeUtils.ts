import { Platform } from 'react-native';

/**
 * Utilitaire pour gérer les routes et les écrans de manière sécurisée
 */

/**
 * Vérifie si un écran est défini et se termine par un suffixe spécifique
 * @param screen Le nom de l'écran à vérifier
 * @param suffix Le suffixe à rechercher
 * @returns true si l'écran se termine par le suffixe, false sinon
 */
export function screenEndsWith(screen: string | undefined | null, suffix: string): boolean {
  if (!screen) return false;
  return screen.endsWith(suffix);
}

/**
 * Vérifie si un écran est défini et commence par un préfixe spécifique
 * @param screen Le nom de l'écran à vérifier
 * @param prefix Le préfixe à rechercher
 * @returns true si l'écran commence par le préfixe, false sinon
 */
export function screenStartsWith(screen: string | undefined | null, prefix: string): boolean {
  if (!screen) return false;
  return screen.startsWith(prefix);
}

/**
 * Vérifie si un écran est défini et correspond exactement à une valeur
 * @param screen Le nom de l'écran à vérifier
 * @param value La valeur exacte à comparer
 * @returns true si l'écran correspond exactement à la valeur, false sinon
 */
export function screenEquals(screen: string | undefined | null, value: string): boolean {
  if (!screen) return false;
  return screen === value;
}

/**
 * Extrait l'ID d'une route dynamique (ex: "activity/123" -> "123")
 * @param route La route complète
 * @param prefix Le préfixe à retirer (ex: "activity/")
 * @returns L'ID extrait ou null si le format est incorrect
 */
export function extractIdFromRoute(route: string | undefined | null, prefix: string): string | null {
  if (!route || !screenStartsWith(route, prefix)) return null;
  return route.substring(prefix.length);
}

/**
 * Construit une route complète à partir d'un préfixe et d'un ID
 * @param prefix Le préfixe de la route (ex: "activity/")
 * @param id L'ID à ajouter
 * @returns La route complète
 */
export function buildRoute(prefix: string, id: string | number): string {
  return `${prefix}${id}`;
}