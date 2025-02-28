import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, LogBox } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { errorHandler } from '../src/utils/errorHandler';

// Ignorer certains avertissements non critiques
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Non-serializable values were found in the navigation state',
]);

export default function RootLayout() {
  const { isDark } = useTheme();

  // Initialiser le gestionnaire d'erreurs global
  useEffect(() => {
    errorHandler.initialize();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.container, !isDark && styles.lightContainer]}>
        <LinearGradient
          colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
          style={styles.background}
        />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="quiz" />
          <Stack.Screen name="food-quiz" />
          <Stack.Screen name="country-selection" />
          <Stack.Screen name="activity/[id]" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={isDark ? "light" : "dark"} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});