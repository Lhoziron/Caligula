import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useThemeStore } from '../../src/store/themeStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuthStore();
  const { isDark } = useThemeStore();
  const { t } = useTranslation();

  const handleRegister = () => {
    if (!firstName || !email || !password || !confirmPassword) {
      Alert.alert(
        t('auth.error.title'),
        t('auth.error.allFieldsRequired')
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t('auth.error.title'),
        t('auth.error.passwordsDoNotMatch')
      );
      return;
    }

    const result = register({
      email,
      firstName,
      password
    });

    if (!result.success) {
      Alert.alert(
        t('auth.error.title'),
        result.error || t('auth.register.error.registrationFailed')
      );
      return;
    }

    router.replace('/(tabs)');
  };

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
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, !isDark && styles.lightTitle]}>
          {t('auth.register.title')}
        </Text>
        
        <Text style={[styles.subtitle, !isDark && styles.lightSubtitle]}>
          {t('auth.register.subtitle')}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, !isDark && styles.lightLabel]}>
              {t('auth.register.firstName')}
            </Text>
            <TextInput
              style={[styles.input, !isDark && styles.lightInput]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('auth.register.firstNamePlaceholder')}
              placeholderTextColor={isDark ? "#666" : "#999"}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, !isDark && styles.lightLabel]}>
              {t('auth.register.email')}
            </Text>
            <TextInput
              style={[styles.input, !isDark && styles.lightInput]}
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.register.emailPlaceholder')}
              placeholderTextColor={isDark ? "#666" : "#999"}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, !isDark && styles.lightLabel]}>
              {t('auth.register.password')}
            </Text>
            <TextInput
              style={[styles.input, !isDark && styles.lightInput]}
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.register.passwordPlaceholder')}
              placeholderTextColor={isDark ? "#666" : "#999"}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, !isDark && styles.lightLabel]}>
              {t('auth.register.confirmPassword')}
            </Text>
            <TextInput
              style={[styles.input, !isDark && styles.lightInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
              placeholderTextColor={isDark ? "#666" : "#999"}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>
              {t('auth.register.button')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={[styles.loginButtonText, !isDark && styles.lightLoginButtonText]}>
              {t('auth.register.haveAccount')}
            </Text>
          </TouchableOpacity>
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
    padding: 20,
    paddingTop: 60,
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  lightTitle: {
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 40,
  },
  lightSubtitle: {
    color: '#666',
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
  registerButton: {
    backgroundColor: '#FF3B7F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#666',
    fontSize: 14,
  },
  lightLoginButtonText: {
    color: '#999',
  },
});