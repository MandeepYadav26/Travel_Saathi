import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';
import { AuthContext } from '../../navigation/AppNavigator';
import * as ImagePicker from 'expo-image-picker';
import InteractiveButton from '../../components/InteractiveButton';
import * as Haptics from 'expo-haptics';

export default function DiaryScreen() {
  const { colors, isDark } = useContext(ThemeContext);
  const { setUserPoints } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [entries, setEntries] = useState([]);

  // Form State
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (photos.length >= 10) {
      Alert.alert('Limit Reached', 'You can only upload up to 10 photos per diary entry.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const calculatePoints = () => {
    const wordCount = description.trim().split(/\s+/).filter(w => w.length > 0).length;
    // Check for spam: 4 or more repeated characters like "wwwww" or "rrrr"
    if (/(.)\1{4,}/.test(description)) {
      return 0;
    }
    const writingPoints = Math.floor(wordCount / 50) * 10;
    const photoPoints = photos.length * 5;
    return writingPoints + photoPoints;
  };

  const handleSave = () => {
    if (!location || !description) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Missing Info', 'Please add at least a location and description.');
      return;
    }
    if (photos.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Missing Info', 'Please add at least 1 photo.');
      return;
    }

    const earned = calculatePoints();
    
    if (earned === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Spam Detected or Too Short', 'Your entry was saved but no points were awarded.');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setUserPoints(prev => prev + earned);
      Alert.alert('Entry Saved!', `You earned ${earned} Travel Points!`);
    }

    const newEntry = {
      id: Date.now().toString(),
      location,
      description,
      photos,
      pointsEarned: earned,
      date: new Date().toDateString()
    };

    setEntries([newEntry, ...entries]);
    setModalVisible(false);

    // Reset Form
    setLocation('');
    setDescription('');
    setPhotos([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Travel Diary</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Share your memories & earn points</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {entries.map(entry => (
          <View key={entry.id} style={[styles.card, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{entry.location}</Text>
            <Text style={{ color: colors.textSecondary, marginBottom: 8, fontWeight: '500' }}>{entry.date}</Text>
            <Text style={{ color: colors.text, marginBottom: 16, lineHeight: 22 }}>{entry.description}</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {entry.photos.map((img, idx) => (
                <Image key={idx} source={{ uri: img }} style={styles.cardImage} />
              ))}
            </ScrollView>

            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>+{entry.pointsEarned} pts</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <InteractiveButton 
        title="+ Add Entry"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        style={styles.fab}
        colors={[colors.primary, colors.secondary]}
      />

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: colors.background }}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Diary Entry</Text>
              <TouchableOpacity onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setModalVisible(false);
              }}>
                <Text style={{ color: colors.error, fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Location (Where did you travel?)"
                placeholderTextColor={colors.textSecondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
              <TextInput
                style={[styles.textArea, { color: colors.text }]}
                placeholder="Write your experience... (50 words = 10 pts)"
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
              />
            </View>

            <View style={styles.imageSection}>
              <Text style={{ color: colors.text, marginBottom: 12, fontWeight: '800', fontSize: 16 }}>Photos ({photos.length}/10) - 5 pts each</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {photos.map((img, idx) => (
                  <Image key={idx} source={{ uri: img }} style={styles.previewImage} />
                ))}
                {photos.length < 10 && (
                  <TouchableOpacity 
                    style={[styles.addImageBtn, { borderColor: colors.primary, backgroundColor: isDark ? '#222' : '#f0f4f8' }]} 
                    onPress={pickImage}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>+ Photo</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            <InteractiveButton 
              title="Save Entry"
              onPress={handleSave}
              style={{ marginTop: 10, marginBottom: 40 }}
              colors={[colors.primary, colors.secondary]}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { fontSize: 16, marginTop: 4, opacity: 0.8 },
  
  list: { paddingHorizontal: 24, paddingBottom: 120 },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    position: 'relative',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  cardImage: { width: 120, height: 120, borderRadius: 12, marginRight: 12 },
  pointsBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsText: { fontWeight: '800', color: '#000', fontSize: 13 },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    left: 24,
  },

  modalContent: { padding: 24, paddingTop: 60 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 26, fontWeight: '800' },
  
  inputContainer: {
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    padding: 18,
    fontSize: 16,
  },
  textArea: {
    padding: 18,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  imageSection: { marginBottom: 16, marginTop: 10 },
  previewImage: { width: 90, height: 90, borderRadius: 12, marginRight: 12 },
  addImageBtn: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed'
  }
});
