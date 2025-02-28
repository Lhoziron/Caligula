import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuizStore } from '../../src/store/quizStore';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { activities } from '../../src/data/activities';
import { getQuestionById } from '../../src/services/quizService';
import ProfileAvatar from '../../src/components/ProfileAvatar';
import AvatarModal from '../../src/components/AvatarModal';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'favorites'>('profile');
  const [selectedPreference, setSelectedPreference] = useState<number | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { answers, setAnswer } = useQuizStore();
  const { getFavorites } = useFavoritesStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const { t } = useTranslation();

  const favorites = getFavorites();
  const favoriteActivities = activities.filter(activity => favorites.includes(activity.id));

  const handleActivityPress = (id: number) => {
    router.push(`/activity/${id}`);
  };

  const handlePreferenceSelect = (questionId: number, option: string) => {
    setAnswer(questionId, option);
    setSelectedPreference(null);
  };

  const handleAvatarSelect = (avatar: { id: string; url: string }) => {
    updateProfile({
      avatarId: avatar.id,
      avatarUrl: avatar.url
    });
    setShowAvatarModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout.title'),
      t('profile.logout.message'),
      [
        {
          text: t('profile.logout.cancel'),
          style: 'cancel'
        },
        {
          text: t('profile.logout.confirm'),
          style: 'destructive',
          onPress: () => {
            useAuthStore.getState().logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, !isDark && styles.lightContainer]}>
        <LinearGradient
          colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
          style={styles.background}
        />
        <View style={styles.notAuthenticatedContainer}>
          <Text style={[styles.notAuthenticatedTitle, !isDark && styles.lightNotAuthenticatedTitle]}>
            {t('profile.notAuthenticated.title')}
          </Text>
          <Text style={[styles.notAuthenticatedMessage, !isDark && styles.lightNotAuthenticatedMessage]}>
            {t('profile.notAuthenticated.message')}
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>
              {t('profile.notAuthenticated.login')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, !isDark && styles.lightContainer]}>
      <LinearGradient
        colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f5f5f5']}
        style={styles.background}
      />

      <View style={[styles.header, !isDark && styles.lightHeader]}>
        <Text style={[styles.title, !isDark && styles.lightTitle]}>
          {t('profile.title')}
        </Text>
        
        <TouchableOpacity
          style={[styles.themeToggle, !isDark && styles.lightThemeToggle]}
          onPress={toggleTheme}
        >
          <View style={styles.themeIconContainer}>
            <Ionicons 
              name={isDark ? "sunny" : "moon"} 
              size={20} 
              color={isDark ? "#FFD700" : "#6B7280"} 
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            !isDark && styles.lightTabButton,
            activeTab === 'profile' && (isDark ? styles.activeTabButton : styles.lightActiveTabButton)
          ]}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons 
            name="person" 
            size={20} 
            color={activeTab === 'profile' ? '#FF3B7F' : (isDark ? '#666' : '#999')} 
          />
          <Text style={[
            styles.tabButtonText,
            !isDark && styles.lightTabButtonText,
            activeTab === 'profile' && styles.activeTabText
          ]}>
            Profil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.tabButton,
            !isDark && styles.lightTabButton,
            activeTab === 'preferences' && (isDark ? styles.activeTabButton : styles.lightActiveTabButton)
          ]}
          onPress={() => setActiveTab('preferences')}
        >
          <Ionicons 
            name="settings" 
            size={20} 
            color={activeTab === 'preferences' ? '#FF3B7F' : (isDark ? '#666' : '#999')} 
          />
          <Text style={[
            styles.tabButtonText,
            !isDark && styles.lightTabButtonText,
            activeTab === 'preferences' && styles.activeTabText
          ]}>
            Préférences
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.tabButton,
            !isDark && styles.lightTabButton,
            activeTab === 'favorites' && (isDark ? styles.activeTabButton : styles.lightActiveTabButton)
          ]}
          onPress={() => setActiveTab('favorites')}
        >
          <Ionicons 
            name="heart" 
            size={20} 
            color={activeTab === 'favorites' ? '#FF3B7F' : (isDark ? '#666' : '#999')} 
          />
          <Text style={[
            styles.tabButtonText,
            !isDark && styles.lightTabButtonText,
            activeTab === 'favorites' && styles.activeTabText
          ]}>
            Favoris ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'profile' && (
          <>
            <View style={[styles.profileSection, !isDark && styles.lightProfileSection]}>
              <ProfileAvatar
                avatarUrl={user?.avatarUrl || 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Felix&backgroundColor=b6e3f4'}
                size={100}
                editable={true}
                onPress={() => setShowAvatarModal(true)}
              />
              
              <Text style={[styles.name, !isDark && styles.lightName]}>
                {user?.firstName || t('profile.defaultName')}
              </Text>
              <Text style={[styles.email, !isDark && styles.lightEmail]}>
                {user?.email || t('profile.defaultEmail')}
              </Text>
              <TouchableOpacity 
                style={[styles.editProfileButton, !isDark && styles.lightEditProfileButton]}
                onPress={() => router.push('/profile/edit')}
              >
                <Ionicons name="pencil" size={16} color={isDark ? "#fff" : "#000"} />
                <Text style={[styles.editProfileButtonText, !isDark && styles.lightEditProfileButtonText]}>
                  {t('profile.edit.button')}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.logoutButton, !isDark && styles.lightLogoutButton]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color={isDark ? "#fff" : "#000"} />
              <Text style={[styles.logoutButtonText, !isDark && styles.lightLogoutButtonText]}>
                {t('profile.logout.button')}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'preferences' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
              Mes Préférences
            </Text>
            
            {[4, 5, 7, 8, 9, 10, 11, 12, 13].map((questionId) => {
              const question = getQuestionById(questionId);
              if (!question) return null;

              return (
                <React.Fragment key={questionId}>
                  <TouchableOpacity
                    style={[styles.preferenceItem, !isDark && styles.lightPreferenceItem]}
                    onPress={() => setSelectedPreference(questionId)}
                  >
                    <Text style={styles.preferenceIcon}>{question.icon}</Text>
                    <View style={styles.preferenceContent}>
                      <Text style={[styles.preferenceQuestion, !isDark && styles.lightPreferenceQuestion]}>
                        {question.text}
                      </Text>
                      <Text style={[styles.preferenceAnswer, !isDark && styles.lightPreferenceAnswer]}>
                        {answers[questionId] || 'Non défini'}
                      </Text>
                    </View>
                    <Ionicons 
                      name="chevron-forward" 
                      size={24} 
                      color={isDark ? "#666" : "#999"} 
                    />
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        )}

        {activeTab === 'favorites' && (
          <View style={styles.section}>
            {favoriteActivities.length === 0 ? (
              <View style={styles.emptyFavorites}>
                <Ionicons name="heart-outline" size={48} color={isDark ? "#666" : "#999"} />
                <Text style={[styles.emptyFavoritesText, !isDark && styles.lightEmptyFavoritesText]}>
                  {t('profile.favorites.empty.message')}
                </Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => router.push('/activities')}
                >
                  <Text style={styles.browseButtonText}>
                    {t('profile.favorites.empty.discover')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              favoriteActivities.map(activity => (
                <TouchableOpacity
                  key={activity.id}
                  style={[styles.favoriteItem, !isDark && styles.lightFavoriteItem]}
                  onPress={() => handleActivityPress(activity.id)}
                >
                  <Image
                    source={{ uri: activity.image }}
                    style={styles.favoriteImage}
                  />
                  <View style={styles.favoriteContent}>
                    <Text style={[styles.favoriteTitle, !isDark && styles.lightFavoriteTitle]}>
                      {activity.title}
                    </Text>
                    <Text style={[styles.favoriteDescription, !isDark && styles.lightFavoriteDescription]} numberOfLines={2}>
                      {activity.description}
                    </Text>
                    <View style={styles.favoriteDetails}>
                      <View style={styles.favoriteInfo}>
                        <Ionicons name="cash-outline" size={16} color={isDark ? "#666" : "#999"} />
                        <Text style={styles.favoritePrice}>{activity.price}</Text>
                      </View>
                      <View style={styles.favoriteInfo}>
                        <Ionicons name="location-outline" size={16} color={isDark ? "#666" : "#999"} />
                        <Text style={[styles.favoriteCity, !isDark && styles.lightFavoriteCity]}>
                          {activity.city}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <AvatarModal
        visible={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarSelect}
        selectedAvatarId={user?.avatarId}
      />
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
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notAuthenticatedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  lightNotAuthenticatedTitle: {
    color: '#000',
  },
  notAuthenticatedMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  lightNotAuthenticatedMessage: {
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#FF3B7F',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  lightHeader: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  lightTitle: {
    color: '#000',
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightThemeToggle: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  themeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    gap: 8,
  },
  lightTabButton: {
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#333',
  },
  lightActiveTabButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  lightTabButtonText: {
    color: '#666',
  },
  activeTabText: {
    color: '#FF3B7F',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    borderRadius: 20,
    padding: 20,
  },
  lightProfileSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    marginTop: 15,
  },
  lightName: {
    color: '#000',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  lightEmail: {
    color: '#666',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  lightEditProfileButton: {
    backgroundColor: '#f0f0f0',
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  lightEditProfileButtonText: {
    color: '#000',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  lightSectionTitle: {
    color: '#000',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  lightPreferenceItem: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  preferenceIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceQuestion: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  lightPreferenceQuestion: {
    color: '#000',
  },
  preferenceAnswer: {
    fontSize: 14,
    color: '#FF3B7F',
  },
  lightPreferenceAnswer: {
    color: '#FF3B7F',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
    gap: 10,
  },
  lightLogoutButton: {
    backgroundColor: '#f0f0f0',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lightLogoutButtonText: {
    color: '#000',
  },
  emptyFavorites: {
    alignItems: 'center',
    padding: 20,
  },
  emptyFavoritesText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  lightEmptyFavoritesText: {
    color: '#666',
  },
  browseButton: {
    backgroundColor: '#FF3B7F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  lightFavoriteItem: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteImage: {
    width: '100%',
    height: 150,
  },
  favoriteContent: {
    padding: 15,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  lightFavoriteTitle: {
    color: '#000',
  },
  favoriteDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  lightFavoriteDescription: {
    color: '#666',
  },
  favoriteDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  favoritePrice: {
    color: '#FF3B7F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteCity: {
    color: '#666',
    fontSize: 14,
  },
  lightFavoriteCity: {
    color: '#999',
  },
});