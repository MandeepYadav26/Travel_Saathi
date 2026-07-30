import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';
import { AuthContext } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const REWARDS = [
  { id: 1, title: '10% Off Taj Hotels', cost: 500, icon: 'bed-outline', description: 'Get a flat 10% discount on your next luxury stay.' },
  { id: 2, title: 'Free Airport Lounge Access', cost: 1200, icon: 'cafe-outline', description: 'Enjoy complimentary food and drinks at partner lounges.' },
  { id: 3, title: 'Uber Airport Transfer', cost: 800, icon: 'car-sport-outline', description: 'One free ride to or from the airport (up to ₹1000).' },
  { id: 4, title: 'MakeMyTrip ₹500 Voucher', cost: 600, icon: 'ticket-outline', description: 'Redeemable on any flight or bus booking.' },
];

export default function RewardsScreen() {
  const { colors, isDark } = useContext(ThemeContext);
  const { userPoints, setUserPoints } = useContext(AuthContext);

  const handleRedeem = (reward) => {
    if (userPoints >= reward.cost) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setUserPoints(prev => prev - reward.cost);
      Alert.alert('Reward Redeemed! 🎉', `You have successfully claimed: ${reward.title}. Check your email for the voucher!`);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Not Enough Points', `You need ${reward.cost - userPoints} more points to claim this reward. Keep writing in your Diary!`);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Rewards</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Redeem your travel points</Text>
      </View>

      {/* Points Dashboard Card */}
      <View style={styles.dashboardWrapper}>
        <LinearGradient
          colors={isDark ? ['#2D3748', '#1A202C'] : [colors.primary, '#8BC34A']}
          style={[styles.pointsCard, { shadowColor: isDark ? '#000' : colors.primary }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="star" size={40} color="#FFD700" style={styles.starIcon} />
          <Text style={styles.pointsLabel}>Available Balance</Text>
          <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
          <Text style={styles.pointsHint}>Earn more points by adding entries and photos to your Travel Diary!</Text>
        </LinearGradient>
      </View>

      {/* Rewards List */}
      <View style={styles.rewardsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Redeemable Offers</Text>
        
        {REWARDS.map((reward) => {
          const canAfford = userPoints >= reward.cost;
          return (
            <TouchableOpacity 
              key={reward.id} 
              activeOpacity={0.8}
              style={[
                styles.rewardCard, 
                { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6', opacity: canAfford ? 1 : 0.6 }
              ]}
              onPress={() => handleRedeem(reward)}
            >
              <View style={[styles.iconBox, { backgroundColor: isDark ? '#2D3748' : '#F0F4F8' }]}>
                <Ionicons name={reward.icon} size={28} color={colors.primary} />
              </View>
              
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, { color: colors.text }]}>{reward.title}</Text>
                <Text style={[styles.rewardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                  {reward.description}
                </Text>
                <View style={styles.costBadge}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={[styles.costText, { color: canAfford ? colors.primary : colors.error }]}>
                    {' '}{reward.cost} pts
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { fontSize: 16, marginTop: 4, fontWeight: '500', opacity: 0.8 },

  dashboardWrapper: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  pointsCard: {
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  starIcon: {
    marginBottom: 8,
  },
  pointsLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pointsValue: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '900',
    marginVertical: 4,
  },
  pointsHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },

  rewardsSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
  },
  rewardCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  rewardDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  costText: {
    fontSize: 14,
    fontWeight: '800',
  }
});
