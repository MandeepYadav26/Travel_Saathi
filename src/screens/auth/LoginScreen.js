import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';
import { AuthContext } from '../../navigation/AppNavigator';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import InteractiveButton from '../../components/InteractiveButton';
import * as Haptics from 'expo-haptics';

export default function LoginScreen({ navigation }) {
  const { colors, isDark } = useContext(ThemeContext);
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      if (auth.app.options.apiKey === 'YOUR_API_KEY') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsAuthenticated(true);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsAuthenticated(true);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (error.message.includes('api-key-not-valid')) {
        Alert.alert('Mock Login', 'Firebase API key is missing. Using Mock Login instead.');
        setIsAuthenticated(true);
      } else {
        Alert.alert('Login Error', error.message);
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
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Login to Travel Saathi</Text>
        
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <InteractiveButton 
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          disabled={loading}
          style={{ marginTop: 8, marginBottom: 16 }}
          colors={[colors.primary, colors.secondary]}
        />

        <TouchableOpacity 
          style={[styles.outlineButton, { borderColor: colors.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Info', 'Google Login requires native setup in a real app.');
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.outlineButtonText, { color: colors.text }]}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Signup');
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.link, { color: colors.secondary }]}>{"Don't have an account? Sign up"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 34,
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
  outlineButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 16,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    padding: 10,
  }
});
