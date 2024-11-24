import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Social media icons
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://your-logo-url-here.png' }} // Replace with your logo
          style={styles.logo}
        />
        <Text style={styles.title}>GreenQuest</Text>
        <Text style={styles.tagline}>Turn trash into treasure!</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.roundButton} onPress={() => router.push('/auth/sign-in')}>
          <Text style={styles.roundButtonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundButton} onPress={() => router.push('/auth/sign-up')}>
          <Text style={styles.roundButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Social Media Icons */}
      <View style={styles.socialMediaContainer}>
        <View style={styles.iconCircle}>
          <FontAwesome name="facebook" size={24} color="#4267B2" />
        </View>
        <View style={styles.iconCircle}>
          <Ionicons name="logo-google" size={24} color="#DB4437" />
        </View>
        <View style={styles.iconCircle}>
          <Ionicons name="logo-instagram" size={24} color="#E1306C" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#EAF8E6', // Light green background
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  tagline: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  roundButton: {
    width: 180,
    height: 50,
    borderRadius: 25, // Circular corners
    backgroundColor: '#FFFFFF', // White background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2, // Green border
    borderColor: '#2E7D32',
    shadowColor: '#000', // Shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  roundButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes the background circular
    backgroundColor: '#fff', // White background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Green border
    borderColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Adds subtle shadow for depth
  },
});
