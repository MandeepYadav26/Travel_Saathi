import * as Haptics from "expo-haptics";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import InteractiveButton from "../../components/InteractiveButton";
import { auth, db } from "../../config/firebase";
import { ThemeContext } from "../../theme/ThemeContext";

export default function SignupScreen({ navigation }) {
  const { colors, isDark } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Alphanumeric constraint to avoid weird spaces
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Invalid Username",
        "Usernames can only contain letters, numbers, and underscores.",
      );
      return;
    }

    setLoading(true);
    try {
      if (auth.app.options.apiKey === "YOUR_API_KEY") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.navigate("Onboarding", { uid: "mock_user_123", username });
        return;
      }

      // 1. Check for Unique Username Globally
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", "==", username.toLowerCase()),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          "Username Taken",
          "This username is already in use by someone else. Please try another one.",
        );
        setLoading(false);
        return;
      }

      // 2. Create the Auth Account
      await createUserWithEmailAndPassword(auth, email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate("Onboarding", {
        uid: auth.currentUser?.uid,
        username,
      });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (error.message.includes("api-key-not-valid")) {
        Alert.alert(
          "Mock Signup",
          "Firebase API key is missing. Using Mock Signup instead.",
        );
        navigation.navigate("Onboarding", { uid: "mock_user_123", username });
      } else {
        Alert.alert("Signup Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Create Account
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Join Travel Saathi today
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surface,
              shadowColor: isDark ? "#000" : "#d1d9e6",
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Choose a Username"
            placeholderTextColor={colors.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surface,
              shadowColor: isDark ? "#000" : "#d1d9e6",
            },
          ]}
        >
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
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surface,
              shadowColor: isDark ? "#000" : "#d1d9e6",
            },
          ]}
        >
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
          title={loading ? "Creating..." : "Sign Up"}
          onPress={handleSignup}
          disabled={loading}
          style={{ marginTop: 8, marginBottom: 16 }}
          colors={[colors.primary, colors.secondary]}
        />

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("Login");
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.link, { color: colors.secondary }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
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
  link: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    padding: 10,
  },
});
