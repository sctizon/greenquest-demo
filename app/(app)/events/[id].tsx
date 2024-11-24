import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '../../../constants/constants';
import { SignUpModal } from '@/components/SignUpModal';
import { useSession } from '@/contexts/ctx';

interface Event {
  id: number;
  eventName: string;
  location: string;
  image: string;
  dateTime: string;
  maxSpots: number;
  participants: { id: number; name: string; email: string }[];
}

export default function EventDetails() {
  const { id } = useLocalSearchParams(); // Dynamic route parameter
  const { session } = useSession(); // Access the logged-in user's session
  const [event, setEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!session) {
    console.log("error session token")
    return;
  }

  useEffect(() => {
    fetch(`${API_URL}/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch event');
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${API_URL}/participants/${id}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId: id,
          userId: session.user.userId,
        }),
      });

      if (!response.ok) throw new Error('Failed to sign up');
      Alert.alert('Success', 'You have signed up for the event!');
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to sign up. Please try again.');
    }
  };

  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  if (!event) return <Text style={styles.error}>Event not found</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.eventName}</Text>
      <Image
        source={{ uri: `${API_URL}${event.image}` }}
        style={styles.image}
      />
      <Text style={styles.subtitle}>Location: {event.location}</Text>
      <Text style={styles.subtitle}>
        Date & Time: {new Date(event.dateTime).toLocaleString()}
      </Text>
      <Text style={styles.subtitle}>
        Spots Left: {event.maxSpots - event.participants.length}
      </Text>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {event && (
        <SignUpModal
          visible={modalVisible}
          eventName={event.eventName}
          userData={{
            name: session.user.fullName,
            email: session.user.email,
          }}
          onClose={() => setModalVisible(false)}
          onSubmit={handleSignUp}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 50,
  },
});