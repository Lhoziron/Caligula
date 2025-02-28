import { Alert, Platform } from 'react-native';

/**
 * Gestionnaire d'erreurs global pour capturer et afficher les erreurs
 * qui pourraient autrement causer un crash silencieux
 */
class ErrorHandler {
  // Stocke les erreurs pour référence
  private errors: Error[] = [];
  
  // Initialise le gestionnaire d'erreurs global
  initialize() {
    // Capture les erreurs non gérées dans les promesses
    const originalHandler = global.ErrorUtils.getGlobalHandler();
    
    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      this.logError(error, isFatal);
      originalHandler(error, isFatal);
    });

    // Capture les erreurs non gérées dans le thread principal
    this.setupErrorBoundary();
  }

  // Configure un boundary pour les erreurs React
  private setupErrorBoundary() {
    if (global.__DEV__) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        // Capture les erreurs de rendu React
        const errorMessage = args.join(' ');
        if (errorMessage.includes('The above error occurred in')) {
          this.logError(new Error(errorMessage), true);
        }
        originalConsoleError(...args);
      };
    }
  }

  // Enregistre et affiche l'erreur
  logError(error: Error, isFatal: boolean = false) {
    this.errors.push(error);
    
    // Log l'erreur dans la console
    console.error(
      `${isFatal ? 'ERREUR FATALE' : 'ERREUR'}: ${error.message}\n` +
      `Stack: ${error.stack}`
    );
    
    // Affiche une alerte pour les erreurs fatales en développement
    if (isFatal && global.__DEV__) {
      setTimeout(() => {
        Alert.alert(
          'Erreur Critique Détectée',
          `Une erreur critique s'est produite: ${error.message}\n\n` +
          'Vérifiez la console pour plus de détails.',
          [{ text: 'OK' }]
        );
      }, 500);
    }
  }

  // Méthode pour envelopper une fonction avec un try/catch
  wrapWithTryCatch<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: Parameters<T>): ReturnType<T> => {
      try {
        return fn(...args);
      } catch (error) {
        this.logError(error as Error);
        // Retourner une valeur par défaut ou undefined
        return undefined as unknown as ReturnType<T>;
      }
    }) as T;
  }

  // Récupère toutes les erreurs enregistrées
  getErrors(): Error[] {
    return [...this.errors];
  }

  // Efface toutes les erreurs enregistrées
  clearErrors(): void {
    this.errors = [];
  }
}

// Exporte une instance singleton
export const errorHandler = new ErrorHandler();

// Fonction utilitaire pour envelopper les fonctions sensibles
export function withErrorHandling<T extends (...args: any[]) => any>(fn: T): T {
  return errorHandler.wrapWithTryCatch(fn);
}