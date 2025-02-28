import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Image } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { Avatar, avatars } from '../data/avatars';

interface AvatarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (avatar: Avatar) => void;
  selectedAvatarId?: string;
}

export default function AvatarModal({
  visible,
  onClose,
  onSelect,
  selectedAvatarId
}: AvatarModalProps) {
  const { isDark } = useThemeStore();

  const renderAvatar = ({ item }: { item: Avatar }) => (
    <TouchableOpacity
      style={[
        styles.avatarItem,
        !isDark && styles.lightAvatarItem,
        selectedAvatarId === item.id && styles.selectedAvatarItem
      ]}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.avatarImage}
      />
      <Text style={[styles.avatarName, !isDark && styles.lightAvatarName]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, !isDark && styles.lightContainer]}>
          <View style={styles.header}>
            <Text style={[styles.title, !isDark && styles.lightTitle]}>
              Choisir un avatar
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, !isDark && styles.lightCloseButtonText]}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={avatars}
            renderItem={renderAvatar}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  lightTitle: {
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  lightCloseButtonText: {
    color: '#000',
  },
  gridContainer: {
    paddingBottom: 20,
  },
  avatarItem: {
    flex: 1,
    margin: 8,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  lightAvatarItem: {
    backgroundColor: '#f5f5f5',
  },
  selectedAvatarItem: {
    borderColor: '#FF3B7F',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  avatarName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  lightAvatarName: {
    color: '#000',
  },
});