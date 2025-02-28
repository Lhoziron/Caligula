import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../src/store/themeStore';
import { useTranslation } from '../../src/hooks/useTranslation';

export default function TabLayout() {
  const { isDark } = useThemeStore();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
          borderTopColor: isDark ? '#333' : '#e5e5e5',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#FF3B7F',
        tabBarInactiveTintColor: isDark ? '#666' : '#999',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('discover.title'),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: t('activities.header.title'),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
