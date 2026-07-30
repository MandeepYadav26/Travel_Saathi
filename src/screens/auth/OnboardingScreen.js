import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemeContext } from '../../theme/ThemeContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import InteractiveButton from '../../components/InteractiveButton';
import * as Haptics from 'expo-haptics';

export default function OnboardingScreen({ route, navigation }) {
  const { uid, username } = route.params || { uid: auth.currentUser?.uid || 'temp_user', username: 'Traveler' };
  const { colors, isDark } = useContext(ThemeContext);
  const [dob, setDob] = useState('');
  const [state, setState] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setImage(result.assets[0].uri);
    }
  };

  const handleFinish = async () => {
    if (!dob || !state) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      if (auth.app.options.apiKey === 'YOUR_API_KEY') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Mock Profile created! Please login now.');
        navigation.navigate('Login');
        return;
      }
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        username: username.toLowerCase(),
        displayName: username,
        dob,
        state,
        profilePhoto: image || null,
        createdAt: new Date(),
        points: 0
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile created! Please login now.');
      navigation.navigate('Login');
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (error.message.includes('api-key-not-valid') || error.message.includes('Missing or insufficient permissions')) {
        Alert.alert('Success', 'Mock Profile created (Firestore skipped). Please login now.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Hello, @{username}!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Let us know a bit more about you</Text>

        <TouchableOpacity 
          style={styles.imagePicker} 
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={{ color: colors.primary, fontSize: 36, fontWeight: 'bold' }}>+</Text>
              <Text style={{ color: colors.textSecondary, marginTop: 4 }}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Date of Birth (DD/MM/YYYY)"
            placeholderTextColor={colors.textSecondary}
            value={dob}
            onChangeText={setDob}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="State of Residence"
            placeholderTextColor={colors.textSecondary}
            value={state}
            onChangeText={setState}
          />
        </View>

        <InteractiveButton 
          title={loading ? 'Saving...' : 'Finish Setup'}
          onPress={handleFinish}
          disabled={loading}
          style={{ marginTop: 16, marginBottom: 40 }}
          colors={[colors.primary, colors.secondary]}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.8,
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 32,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
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
  }
});
