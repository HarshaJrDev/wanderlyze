import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fonts } from '../../utils/fonts';
import Button from '../../components/Button';
import { COLORS } from '../../constants/Colors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Config from '../../config/Config';

const interestsList = ['Adventure', 'Culture', 'Nature', 'Relaxation', 'History', 'Food'];

const HomeScreen = () => {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tripDetails, setTripDetails] = useState<string>('');
  const [placeDetails, setPlaceDetails] = useState<any[]>([]);
  const [unsplashImages, setUnsplashImages] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const planTrip = async () => {
    if (!destination || !startDate || !endDate) {
      Alert.alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch place coordinates
      const geoRes = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${destination}&apiKey=${Config.Geoapify_Api}`
      );
      const geoData = await geoRes.json();
      const location = geoData.features[0]?.geometry.coordinates;

      if (!location) throw new Error('Location not found');

      const [lon, lat] = location;

      // 2. Fetch nearby POIs (tourist attractions, hotels, restaurants)
      const poiTypes = ['tourism', 'accommodation', 'catering'];
      const poiRes = await fetch(
        `https://api.geoapify.com/v2/places?categories=${poiTypes.join(',')}&filter=circle:${lon},${lat},5000&limit=10&apiKey=${Config.Geoapify_Api}`
      );
      const poiData = await poiRes.json();
      const enrichedPlaces = await Promise.all(
        poiData.features.map(async (place: any) => {
          const name = place.properties.name || place.properties.address_line1;
          const wiki = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`)
            .then(res => res.json())
            .catch(() => ({}));
          return {
            name,
            address: place.properties.formatted,
            category: place.properties.categories?.[0],
            image: wiki.thumbnail?.source || null,
            summary: wiki.extract || 'No details available.',
          };
        })
      );
      setPlaceDetails(enrichedPlaces);

      // 3. Fetch Unsplash images
      const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${destination}&per_page=10&orientation=landscape&order_by=relevant&content_filter=high&client_id=${Config.Unsplash_Access_Key}`);
      const unsplashData = await unsplashRes.json();
      const imageUrls = unsplashData.results?.map((img: any) => img.urls?.regular).filter(Boolean) || [];
      setUnsplashImages(imageUrls);

      // 4. Ask Gemini for itinerary
      const prompt = `Plan a trip to ${destination} from ${startDate.toDateString()} to ${endDate.toDateString()}.
        Interests: ${selectedInterests.join(', ') || 'General'}.
        Budget: ${budget || 'Flexible'}.
        Suggest an itinerary with activities, local tips, and must-visits.`;

      const genAI = new GoogleGenerativeAI(Config.Gemini_Api);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setTripDetails(text);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch trip details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Trip Planner</Text>

        <TextInput
          label="Destination"
          value={destination}
          onChangeText={setDestination}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { text: '#fff', primary: COLORS.primary, background: '#1e293b' } }}
        />

        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>{startDate ? startDate.toDateString() : 'Start Date'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>{endDate ? endDate.toDateString() : 'End Date'}</Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <Text style={styles.label}>Select Interests</Text>
        <View style={styles.chipsContainer}>
          {interestsList.map((interest) => (
            <TouchableOpacity
              key={interest}
              onPress={() => toggleInterest(interest)}
              style={[styles.chip, selectedInterests.includes(interest) && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selectedInterests.includes(interest) && styles.chipTextSelected]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          label="Budget (optional)"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { text: '#fff', primary: COLORS.primary, background: '#1e293b' } }}
        />

        <Button onPress={planTrip} style={styles.button}>
          <Text style={styles.buttonText}>✨ Ask Gemini to Plan My Trip</Text>
        </Button>

        {loading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />}

        {!!unsplashImages.length && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 20 }}>
            {unsplashImages.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={{ height: 200, width: 300, marginRight: 10, borderRadius: 10 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {!!tripDetails && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>🧭 AI Itinerary</Text>
            <Text style={{ color: '#fff', marginTop: 8 }}>{tripDetails}</Text>
          </View>
        )}

        {!!placeDetails.length && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>🌍 Places to Explore</Text>
            {placeDetails.map((place, index) => (
              <View key={index} style={{ marginBottom: 20 }}>
                {place.image && (
                  <Image
                    source={{ uri: place.image }}
                    style={{ height: 150, borderRadius: 10, marginBottom: 6 }}
                    resizeMode="cover"
                  />
                )}
                <Text style={{ fontSize: 16, color: COLORS.primary, fontFamily: fonts.bold }}>{place.name}</Text>
                <Text style={{ color: '#cbd5e1' }}>{place.address}</Text>
                <Text style={{ color: '#fff', marginTop: 6 }}>{place.summary}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1e293b',
    fontFamily: fonts.medium,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontFamily: fonts.medium,
  },
  label: {
    fontSize: 14,
    color: '#cbd5e1',
    fontFamily: fonts.medium,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#475569',
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: '#cbd5e1',
    fontFamily: fonts.medium,
  },
  chipTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: COLORS.primary,
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.medium,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default HomeScreen;
