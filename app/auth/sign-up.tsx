import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // For icons
import { API_URL } from '@/constants/constants';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
  
      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'You can now sign in.',
        });
        router.push('/auth/sign-in'); // Redirect to login
      } else {
        const error = await response.json();
        alert(error.message || 'Registration failed');
      }
      // router.push('/sign-in');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>

      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
        <Text style={styles.signupButtonText}>SIGN UP</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>

      {/* Already Have an Account */}
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.loginLink}>SIGN IN</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF8E6', // Light green background
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  loginText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  loginLink: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});
