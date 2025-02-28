import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useThemeStore } from '../../src/store/themeStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRequireAuth } from '../../src/hooks/useRequireAuth';

export default function EditProfileScreen() {
  const isAuthenticated = useRequireAuth();
  const { user, updateProfile } = useAuthStore();
  const { isDark } = useThemeStore();
  const { t } = useTranslation();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (!firstName.trim()) {
      Alert.alert(
        t('profile.edit.errors.title'),
        t('profile.edit.errors.emptyName')
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        t('profile.edit.errors.title'),
        t('profile.edit.errors.invalidEmail')
      );
      return;
    }

    // Mettre à jour le profil
    updateProfile({
      firstName,
      email,
    });

    Alert.alert(
      t('profile.edit.success.title'),
      t('profile.edit.success.message'),
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={[styles.container, !isDark && styles.lightContainer]}>
      <LinearGradient
        colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
        style={styles.background}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, !isDark && styles.lightBackButton]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.title, !isDark && styles.lightTitle]}>
          {t('profile.edit.button')}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, !isDark && styles.lightLabel]}>
              {t('profile.edit.firstName')}
            </Text>
            <TextInput
              style={[styles.input, !isDark && styles.lightInput]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('profile.edit.firstNamePlaceholder')}
              placeholderTextColor={isDark ? "#666" : "#999"}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, !isDark && styles.lightLabel]}>
              {t('profile.edit.email')}
            </Text>
            <TextInput
              style={[styles.input, !isDark && styles.lightInput]}
              value={email}
              onChangeText={setEmail}
              placeholder={t('profile.edit.emailPlaceholder')}
              placeholderTextColor={isDark ? "#666" : "#999"}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, !isDark && styles.lightCancelButton]}
              onPress={() => router.back()}
            >
              <Text style={[styles.buttonText, !isDark && styles.lightButtonText]}>
                {t('profile.edit.cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {t('profile.edit.save')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    gap: 20,
  },
  backButton: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightBackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  lightTitle: {
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  lightLabel: {
    color: '#000',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  lightInput: {
    backgroundColor: '#fff',
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  lightCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#FF3B7F',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lightButtonText: {
    color: '#000',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
