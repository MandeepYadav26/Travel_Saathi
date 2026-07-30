import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';
import { AuthContext } from '../../navigation/AppNavigator'; // Assuming AuthContext is exported from AppNavigator
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useContext(ThemeContext);
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of Travel Saathi?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => {
            // In a real app, sign out of Firebase here: auth.signOut()
            setIsAuthenticated(false);
          }
        }
      ]
    );
  };

  const renderSettingItem = (icon, title, value, type = 'navigate', onToggle = null) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      disabled={type === 'switch'}
      activeOpacity={0.7}
      onPress={() => {
        if (type === 'navigate') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Alert.alert('Coming Soon', `${title} settings will be available soon.`);
        }
      }}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconBox, { backgroundColor: isDark ? '#2D3748' : '#F0F4F8' }]}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
      </View>
      
      {type === 'switch' ? (
        <Switch 
          value={value} 
          onValueChange={(val) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (onToggle) onToggle(val);
          }} 
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={value ? '#ffffff' : '#f4f3f4'}
        />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {value && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>}
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={[styles.avatarBox, { borderColor: colors.primary }]}>
          <Text style={styles.avatarText}>TS</Text>
        </View>
        <Text style={[styles.profileName, { color: colors.text }]}>Traveler</Text>
        <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>traveler@example.com</Text>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>Pro Member</Text>
        </View>
      </View>

      {/* Settings Groups */}
      <View style={styles.settingsGroup}>
        <Text style={[styles.groupTitle, { color: colors.primary }]}>PREFERENCES</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {renderSettingItem('moon', 'Dark Mode', isDark, 'switch', toggleTheme)}
          {renderSettingItem('notifications', 'Push Notifications', true, 'switch')}
          {renderSettingItem('globe', 'Language', 'English')}
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <Text style={[styles.groupTitle, { color: colors.primary }]}>ACCOUNT</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {renderSettingItem('person', 'Edit Profile', '')}
          {renderSettingItem('shield-checkmark', 'Privacy & Security', '')}
          {renderSettingItem('card', 'Payment Methods', '')}
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <Text style={[styles.groupTitle, { color: colors.primary }]}>SUPPORT</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {renderSettingItem('help-circle', 'Help Center', '')}
          {renderSettingItem('information-circle', 'About Travel Saathi', 'v1.0.0')}
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutBtn, { borderColor: colors.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.error} style={{ marginRight: 8 }} />
        <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, paddingBottom: 10 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: 0.5 },

  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0066FF',
    letterSpacing: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  settingsGroup: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 1,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 15,
    marginRight: 8,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '800',
  }
});
