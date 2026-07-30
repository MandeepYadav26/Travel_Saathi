import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';
import InteractiveButton from '../../components/InteractiveButton';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const MOCK_HOTELS = [
  { id: 1, name: 'Taj Mahal Palace', location: 'Mumbai', price: '₹12,000/night', rating: 4.9, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Mumbai_Aug_2018_%2843397784544%29.jpg/800px-Mumbai_Aug_2018_%2843397784544%29.jpg' },
  { id: 2, name: 'Rambagh Palace', location: 'Jaipur', price: '₹15,000/night', rating: 4.8, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Hawa_Mahal_Jaipur_India.jpg/800px-Hawa_Mahal_Jaipur_India.jpg' },
  { id: 3, name: 'Aloha on the Ganges', location: 'Rishikesh', price: '₹4,500/night', rating: 4.5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Rishikesh_1_-_2015.jpg/800px-Rishikesh_1_-_2015.jpg' },
  { id: 4, name: 'Snow Valley Resorts', location: 'Manali', price: '₹3,000/night', rating: 4.3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Solang_Valley_Manali.jpg/800px-Solang_Valley_Manali.jpg' }
];

export default function BookingsScreen() {
  const { colors, isDark } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' or 'travel'

  // Hotel State
  const [hotelSearch, setHotelSearch] = useState('');
  
  // Travel State
  const [travelType, setTravelType] = useState('flight'); // 'flight', 'train', 'bus'
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleBook = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Booking Confirmed', 'This is a demo. Your mock booking has been placed!');
  };

  const handleSearchTransport = () => {
    if (!origin || !destination) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Missing Details', 'Please enter both origin and destination.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Searching...', `Looking for ${travelType}s from ${origin} to ${destination}`);
  };

  const renderHotels = () => (
    <View style={styles.contentContainer}>
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search by city (e.g. Mumbai)"
          placeholderTextColor={colors.textSecondary}
          value={hotelSearch}
          onChangeText={setHotelSearch}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Stays</Text>
      
      {MOCK_HOTELS.filter(h => h.location.toLowerCase().includes(hotelSearch.toLowerCase())).map((hotel) => (
        <View key={hotel.id} style={[styles.card, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
          <Image source={{ uri: hotel.image }} style={styles.cardImage} />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{hotel.name}</Text>
            <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>📍 {hotel.location}</Text>
            
            <View style={styles.cardBottomRow}>
              <View>
                <Text style={[styles.cardPrice, { color: colors.text }]}>{hotel.price}</Text>
                <Text style={styles.cardRating}>⭐ {hotel.rating}</Text>
              </View>
              <InteractiveButton 
                title="Book" 
                onPress={handleBook} 
                colors={[colors.primary, colors.secondary]} 
                style={{ minWidth: 90, paddingVertical: 10 }} 
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTravel = () => (
    <View style={styles.contentContainer}>
      
      <View style={styles.travelTypeSelector}>
        {['flight', 'train', 'bus'].map((type) => (
          <TouchableOpacity 
            key={type}
            style={[
              styles.travelTypeBtn, 
              { backgroundColor: travelType === type ? colors.primary : colors.surface }
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTravelType(type);
            }}
          >
            <Ionicons 
              name={type === 'flight' ? 'airplane' : type === 'train' ? 'train' : 'bus'} 
              size={20} 
              color={travelType === type ? '#fff' : colors.textSecondary} 
            />
            <Text style={[
              styles.travelTypeText, 
              { color: travelType === type ? '#fff' : colors.textSecondary }
            ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.formContainer, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
        <View style={styles.formRow}>
          <Ionicons name="location-outline" size={24} color={colors.textSecondary} style={styles.formIcon} />
          <TextInput
            style={[styles.formInput, { color: colors.text, borderBottomColor: colors.border }]}
            placeholder="From (Origin)"
            placeholderTextColor={colors.textSecondary}
            value={origin}
            onChangeText={setOrigin}
          />
        </View>
        
        <View style={styles.formRow}>
          <Ionicons name="location" size={24} color={colors.primary} style={styles.formIcon} />
          <TextInput
            style={[styles.formInput, { color: colors.text, borderBottomColor: colors.border }]}
            placeholder="To (Destination)"
            placeholderTextColor={colors.textSecondary}
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <View style={styles.formRow}>
          <Ionicons name="calendar-outline" size={24} color={colors.textSecondary} style={styles.formIcon} />
          <TextInput
            style={[styles.formInput, { color: colors.text, borderBottomColor: 'transparent' }]}
            placeholder="Date (DD/MM/YYYY)"
            placeholderTextColor={colors.textSecondary}
            value={date}
            onChangeText={setDate}
          />
        </View>
      </View>

      <InteractiveButton 
        title="Search Transport" 
        onPress={handleSearchTransport} 
        colors={[colors.primary, colors.secondary]} 
        style={{ marginTop: 24 }} 
      />

    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Bookings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Plan your perfect trip</Text>
      </View>

      <View style={styles.segmentContainer}>
        <TouchableOpacity 
          style={[styles.segmentBtn, activeTab === 'hotels' && { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#ccc', elevation: 2 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('hotels');
          }}
        >
          <Text style={[styles.segmentText, { color: activeTab === 'hotels' ? colors.primary : colors.textSecondary, fontWeight: activeTab === 'hotels' ? '800' : '500' }]}>🏨 Hotels</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.segmentBtn, activeTab === 'travel' && { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#ccc', elevation: 2 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('travel');
          }}
        >
          <Text style={[styles.segmentText, { color: activeTab === 'travel' ? colors.primary : colors.textSecondary, fontWeight: activeTab === 'travel' ? '800' : '500' }]}>✈️ Travel</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'hotels' ? renderHotels() : renderTravel()}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { fontSize: 16, marginTop: 4, fontWeight: '500', opacity: 0.8 },
  
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },

  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  /* Hotels Styles */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 15,
    marginBottom: 16,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  cardRating: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },

  /* Travel Styles */
  travelTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  travelTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  travelTypeText: {
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  formContainer: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formIcon: {
    marginRight: 16,
  },
  formInput: {
    flex: 1,
    paddingVertical: 20,
    fontSize: 16,
    borderBottomWidth: 1,
  }
});
