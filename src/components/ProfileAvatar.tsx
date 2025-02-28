import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';

interface ProfileAvatarProps {
  size?: number;
  avatarUrl: string;
  onPress?: () => void;
  editable?: boolean;
}

export default function ProfileAvatar({
  size = 100,
  avatarUrl,
  onPress,
  editable = false
}: ProfileAvatarProps) {
  const { isDark } = useThemeStore();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 }
      ]}
      onPress={onPress}
      disabled={!editable}
      activeOpacity={editable ? 0.7 : 1}
    >
      <View style={[
        styles.avatarWrapper,
        { width: size, height: size, borderRadius: size / 2 }
      ]}>
        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.avatar,
            { width: size - 6, height: size - 6, borderRadius: (size - 6) / 2 }
          ]}
        />
      </View>
      {editable && (
        <View style={[styles.editButton, !isDark && styles.lightEditButton]}>
          <Ionicons name="camera" size={16} color={isDark ? "#fff" : "#000"} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarWrapper: {
    backgroundColor: '#FF3B7F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#333',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B7F',
  },
  lightEditButton: {
    backgroundColor: '#fff',
  },
});