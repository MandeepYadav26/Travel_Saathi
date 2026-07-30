import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';
import InteractiveButton from '../../components/InteractiveButton';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI only if the API key is provided
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const DESTINATIONS = {
  rishikesh: {
    name: 'Rishikesh',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Rishikesh_1_-_2015.jpg/800px-Rishikesh_1_-_2015.jpg',
    details: 'The Yoga Capital of the World. Prices: Hostels from ₹500/night, Hotels from ₹1500/night. River Rafting starting at ₹600/person. Best time to visit: Sep-Nov & Feb-Apr.',
    aiSummary: `[AI Summary for Rishikesh]: Popular locations: Ram Jhula, Laxman Jhula, Triveni Ghat, Beatles Ashram. Known for spiritual retreats, yoga centers, and adventure sports like bungee jumping and river rafting. Moderate budget needed.`
  },
  mumbai: {
    name: 'Mumbai',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Mumbai_Aug_2018_%2843397784544%29.jpg/800px-Mumbai_Aug_2018_%2843397784544%29.jpg',
    details: 'The City of Dreams. Prices: Budget stays from ₹1500/night, Mid-range from ₹4000/night. Vada Pav at ₹20. Local trains are the lifeline. Best time to visit: Nov-Feb.',
    aiSummary: `[AI Summary for Mumbai]: Top spots: Gateway of India, Marine Drive, Juhu Beach, Elephanta Caves. Known for Bollywood, fast-paced life, and vibrant street food. High budget recommended for premium areas.`
  },
  jaipur: {
    name: 'Jaipur',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Hawa_Mahal_Jaipur_India.jpg/800px-Hawa_Mahal_Jaipur_India.jpg',
    details: 'The Pink City. Prices: Heritage Havelis from ₹2500/night. Fort entry fees range from ₹50-₹200. Best time to visit: Oct-Mar.',
    aiSummary: `[AI Summary for Jaipur]: Key attractions: Amber Fort, Hawa Mahal, City Palace, Jantar Mantar. Famous for royal Rajasthani architecture, block printing, and jewelry. Moderate budget.`
  },
  delhi: {
    name: 'Delhi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/India_Gate_in_New_Delhi_03-2016.jpg/800px-India_Gate_in_New_Delhi_03-2016.jpg',
    details: 'The Capital City. Prices: Stays vary wildly from ₹800/night to luxury. Metro travel is very cheap (₹10-₹60). Best time to visit: Oct-Mar.',
    aiSummary: `[AI Summary for Delhi]: Historic monuments: Red Fort, Qutub Minar, India Gate, Lotus Temple. Exceptional street food in Chandni Chowk. A mix of rich history and modern metropolitan life. Flexible budget.`
  },
  manali: {
    name: 'Manali',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Solang_Valley_Manali.jpg/800px-Solang_Valley_Manali.jpg',
    details: 'Valley of the Gods. Prices: Cottages from ₹1500/night. Paragliding around ₹2000. Snowfall in Dec-Feb. Best time to visit: Oct-Jun.',
    aiSummary: `[AI Summary for Manali]: Highlights: Rohtang Pass, Solang Valley, Hidimba Temple. A premier hill station offering snow sports, trekking, and beautiful Himalayan landscapes. Moderate to High budget.`
  },
  shimla: {
    name: 'Shimla',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Shimla_from_the_air.jpg/800px-Shimla_from_the_air.jpg',
    details: 'Queen of Hill Stations. Prices: Hotels from ₹2000/night. Toy train ride is highly recommended. Best time to visit: Mar-Jun & Nov-Jan.',
    aiSummary: `[AI Summary for Shimla]: Top places: The Ridge, Mall Road, Jakhoo Temple. Renowned for its colonial architecture and pleasant climate. Moderate budget.`
  },
  mussoorie: {
    name: 'Mussoorie',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mussoorie_hills.jpg/800px-Mussoorie_hills.jpg',
    details: 'Queen of the Hills. Prices: Stays from ₹1800/night. Cable car ride is popular. Best time to visit: Apr-Jun & Sep-Nov.',
    aiSummary: `[AI Summary for Mussoorie]: Main sights: Kempty Falls, Camel's Back Road, Mall Road. Offers stunning views of the Doon Valley and Shivalik ranges. Moderate budget.`
  },
  dehradun: {
    name: 'Dehradun',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Forest_Research_Institute_Dehradun_Uttarakhand.jpg/800px-Forest_Research_Institute_Dehradun_Uttarakhand.jpg',
    details: 'The Doon Valley. Prices: Hotels from ₹1200/night. Great cafes and pleasant weather. Best time to visit: Mar-Jun & Sep-Nov.',
    aiSummary: `[AI Summary for Dehradun]: Famous for: Robber's Cave, Sahastradhara, Forest Research Institute. A relaxed educational and natural hub. Low to Moderate budget.`
  },
  neelkanth: {
    name: 'Neelkanth',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Neelkanth_Mahadev_Temple%2C_Rishikesh.jpg/800px-Neelkanth_Mahadev_Temple%2C_Rishikesh.jpg',
    details: 'Sacred Shiva Temple located 32km from Rishikesh. Prices: Basic guest houses from ₹500/night. Best time to visit: Feb-May.',
    aiSummary: `[AI Summary for Neelkanth Mahadev]: A deeply spiritual destination surrounded by dense forests and mountain ranges. Primarily a pilgrimage site with basic amenities. Low budget.`
  },
  kedarnath: {
    name: 'Kedarnath',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Kedarnath_Temple_Uttarakhand.jpg/800px-Kedarnath_Temple_Uttarakhand.jpg',
    details: 'One of the Char Dhams. Prices: Tents/Ashrams from ₹300-₹1000/night. Helicopter rides available. Temple opens Apr-Nov. Best time to visit: May-Jun & Sep-Oct.',
    aiSummary: `[AI Summary for Kedarnath]: Essential pilgrimage site dedicated to Lord Shiva. Requires a tough 16km trek from Gaurikund or helicopter access. Breathtaking high-altitude Himalayan setting. Moderate budget due to travel logistics.`
  }
};

const ALL_PLACES = [
  { id: 1, name: 'Rishikesh', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Rishikesh_1_-_2015.jpg/800px-Rishikesh_1_-_2015.jpg', context: 'The Yoga Capital of the World.' },
  { id: 2, name: 'Mumbai', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Mumbai_Aug_2018_%2843397784544%29.jpg/800px-Mumbai_Aug_2018_%2843397784544%29.jpg', context: 'The City of Dreams & Bollywood.' },
  { id: 3, name: 'Jaipur', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Hawa_Mahal_Jaipur_India.jpg/800px-Hawa_Mahal_Jaipur_India.jpg', context: 'The Pink City of India.' },
  { id: 4, name: 'Delhi', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/India_Gate_in_New_Delhi_03-2016.jpg/800px-India_Gate_in_New_Delhi_03-2016.jpg', context: 'The Historic Capital City.' },
  { id: 5, name: 'Manali', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Solang_Valley_Manali.jpg/800px-Solang_Valley_Manali.jpg', context: 'Valley of the Gods.' },
  { id: 6, name: 'Shimla', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Shimla_from_the_air.jpg/800px-Shimla_from_the_air.jpg', context: 'Queen of Hill Stations.' },
  { id: 7, name: 'Mussoorie', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mussoorie_hills.jpg/800px-Mussoorie_hills.jpg', context: 'Queen of the Hills.' },
  { id: 8, name: 'Dehradun', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Forest_Research_Institute_Dehradun_Uttarakhand.jpg/800px-Forest_Research_Institute_Dehradun_Uttarakhand.jpg', context: 'The Doon Valley.' },
  { id: 9, name: 'Neelkanth', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Neelkanth_Mahadev_Temple%2C_Rishikesh.jpg/800px-Neelkanth_Mahadev_Temple%2C_Rishikesh.jpg', context: 'Sacred Shiva Temple in the mountains.' },
  { id: 10, name: 'Kedarnath', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Kedarnath_Temple_Uttarakhand.jpg/800px-Kedarnath_Temple_Uttarakhand.jpg', context: 'High-altitude Himalayan pilgrimage.' }
];

export default function HomeScreen() {
  const { colors, isDark } = useContext(ThemeContext);
  const scrollViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [shuffledPlaces, setShuffledPlaces] = useState([]);

  useEffect(() => {
    // Shuffle places every time the screen loads
    const shuffled = [...ALL_PLACES].sort(() => 0.5 - Math.random());
    setShuffledPlaces(shuffled.slice(0, 5)); // Show 5 random places
  }, []);

  const handleSearch = async (overrideQuery) => {
    try {
      const q = typeof overrideQuery === 'string' ? overrideQuery : searchQuery;
      const query = (q || '').trim().toLowerCase();
      if (!query) return;
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (DESTINATIONS[query]) {
        setSelectedPlace(DESTINATIONS[query]);
      } else {
        // Fallback for an unknown destination: try to fetch real AI data!
        const fallbackPlace = {
          name: q,
          details: 'We are gathering specific pricing information. Stay tuned!',
          aiSummary: '✨ Generating live AI summary... please wait.'
        };
        setSelectedPlace(fallbackPlace);

        if (genAI) {
          try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Write a short, engaging travel summary for ${q}. Include top attractions, a vibe check, and budget recommendations. Keep it under 4 sentences.`;
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            setSelectedPlace({
              ...fallbackPlace,
              aiSummary: text
            });
          } catch(e) {
            setSelectedPlace({
              ...fallbackPlace,
              aiSummary: `[AI Error]: Could not load summary. ${e.message}`
            });
          }
        } else {
          setSelectedPlace({
            ...fallbackPlace,
            aiSummary: `[AI Note]: ${q} is a wonderful place! However, to see dynamic AI summaries, please provide a Google Gemini API Key in the .env file as EXPO_PUBLIC_GEMINI_API_KEY.`
          });
        }
      }

      // Scroll smoothly back to the top to see the results
      if (scrollViewRef.current && scrollViewRef.current.scrollTo) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    } catch (error) {
      console.error(error);
      alert('Error in search: ' + error.message);
    }
  };

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Explore India</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your Travel Planner</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Where to? (e.g. Rishikesh)"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <InteractiveButton 
          title="Search"
          onPress={() => handleSearch()}
          style={styles.searchBtn}
          colors={[colors.primary, colors.secondary]}
        />
      </View>

      {selectedPlace && (
        <View style={[styles.resultCard, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}>
          {selectedPlace.image && (
            <Image source={{ uri: selectedPlace.image }} style={styles.resultImage} />
          )}
          <Text style={[styles.resultTitle, { color: colors.text }]}>{selectedPlace.name}</Text>
          <Text style={[styles.resultDetails, { color: colors.textSecondary }]}>{selectedPlace.details}</Text>
          <LinearGradient
            colors={isDark ? ['#2D3748', '#1A202C'] : ['#E6F4FE', '#F7F9FC']}
            style={styles.aiBox}
          >
            <Text style={[styles.aiTitle, { color: colors.primary }]}>✨ AI Summary</Text>
            <Text style={{ color: colors.text, marginTop: 6, lineHeight: 22 }}>{selectedPlace.aiSummary}</Text>
          </LinearGradient>
        </View>
      )}

      <View style={styles.suggestedSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Suggested Places</Text>
        <View style={styles.suggestedListVertical}>
          {shuffledPlaces.map((place) => (
            <TouchableOpacity 
              key={place.id} 
              style={[styles.suggestedCardVertical, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#d1d9e6' }]}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSearchQuery(place.name);
                handleSearch(place.name); // Instantly search when tapped
              }}
            >
              <Image source={{ uri: place.image }} style={styles.suggestedImageLarge} />
              <View style={styles.suggestedInfoVertical}>
                <Text style={[styles.suggestedNameVertical, { color: colors.text }]}>{place.name}</Text>
                <Text style={[styles.suggestedContext, { color: colors.textSecondary }]} numberOfLines={2}>
                  {place.context}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { fontSize: 18, marginTop: 4, fontWeight: '500' },
  
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 30,
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    borderRadius: 12,
    marginRight: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    padding: 16,
    fontSize: 16,
  },
  searchBtn: {
    minWidth: 100,
  },

  resultCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  resultImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  resultTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  resultDetails: { fontSize: 15, marginBottom: 16, lineHeight: 22 },
  aiBox: {
    padding: 16,
    borderRadius: 12,
  },
  aiTitle: { fontWeight: '800', fontSize: 15 },

  suggestedSection: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20 },
  suggestedListVertical: { flexDirection: 'column' },
  suggestedCardVertical: { 
    flexDirection: 'column',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  suggestedImageLarge: { 
    width: '100%', 
    height: 220,
    resizeMode: 'cover'
  },
  suggestedInfoVertical: {
    padding: 20,
  },
  suggestedNameVertical: { 
    fontWeight: '800', 
    fontSize: 22, 
    marginBottom: 6,
    letterSpacing: 0.5
  },
  suggestedContext: {
    fontSize: 16,
    lineHeight: 22,
  }
});
