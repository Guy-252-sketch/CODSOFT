import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Share,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const QUOTES = [
  "Believe in yourself and all that you are.",
  "Every day is a second chance.",
  "Your limitation—it’s only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Stay positive. Work hard. Make it happen.",
];

export default function App() {
  const [quote, setQuote] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    refreshQuote();
  }, []);

  const refreshQuote = () => {
    const newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(newQuote);
  };

  const addFavorite = () => {
    if (!favorites.includes(quote)) {
      setFavorites([...favorites, quote]);
      Alert.alert('Saved', 'Added to favorites!');
    } else {
      Alert.alert('Already saved', 'This quote is already in your favorites.');
    }
  };

  const removeFavorite = (quoteToRemove) => {
    setFavorites(favorites.filter(f => f !== quoteToRemove));
  };

  const shareQuote = async () => {
    try {
      await Share.share({ message: quote });
    } catch (error) {
      Alert.alert('Unable to share', 'Something went wrong.');
    }
  };

  return (
    <LinearGradient colors={['#74ebd5', '#ACB6E5']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>✨ Daily Inspiration ✨</Text>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>{quote}</Text>
        </View>

        <View style={styles.buttonRow}>
          <StyledButton icon="refresh" label="Refresh" onPress={refreshQuote} />
          <StyledButton icon="share-social" label="Share" onPress={shareQuote} />
          <StyledButton icon="heart" label="Favorite" onPress={addFavorite} />
        </View>

        {favorites.length > 0 && (
          <ScrollView style={styles.favorites}>
            <Text style={styles.subtitle}>⭐ Favorites</Text>
            {favorites.map((f, i) => (
              <View key={i} style={styles.favoriteItem}>
                <Text style={styles.favoriteText}>“{f}”</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFavorite(f)}
                >
                  <Ionicons name="trash" size={18} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </LinearGradient>
  );
}

function StyledButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name={icon} size={20} color="#fff" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  quoteCard: {
    backgroundColor: '#ffffffcc',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 30,
  },
  quoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  favorites: {
    flex: 1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  favoriteItem: {
    backgroundColor: '#ffffffcc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    padding: 6,
  },
});

