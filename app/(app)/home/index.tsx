import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../../../constants/constants';
import { SignUpModal } from '../../../components/SignUpModal'; // Import the modal
import { useSession } from '@/contexts/ctx';

interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Event {
  id: number;
  eventName: string;
  location: string;
  image: string;
  dateTime: string;
  maxSpots: number;
  participants: Participant[];
  creatorName: string;
}

export default function HomeTab() {
  const { session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  // const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const response = await fetch(`${API_URL}/events`);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const data: Event[] = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
      };
    
      fetchEvents();
  }, []);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
    setSelectedEvent(null); // Clear the selected event
  };
  

  const handleSignUp = async () => {
    if (!selectedEvent || !session) return;

    try {
      const response = await fetch(`${API_URL}/participants/${selectedEvent.id}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId: selectedEvent.id,
          userId: session.user.userId 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Backend Error:', error);
        throw new Error(error.error || 'Failed to sign up from home');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up. Please try again.');
    }
  };

  // if (!isAuthenticated) {
  //   return router.replace('/') // Or redirect immediately
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>GreenQuest</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* User Section */}
            <View style={styles.userSection}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar} />
                <View>
                  <Text style={styles.username}>{item.creatorName || 'Unkown User'}</Text>
                  <Text style={styles.location}>{item.location}</Text>
                </View>
              </View>
            </View>

            {/* Media Section */}
            <Image
              source={{
                uri: `${API_URL}${item.image}`,
              }}
              onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
              style={styles.image}
            />

            {/* Content Section */}
            <View style={styles.cardContent}>
              {/* Event Name */}
              <Text style={styles.title}>{item.eventName}</Text>

              {/* Date and Time */}
              <View style={styles.row}>
                <Text style={styles.label}>Date: {new Date(item.dateTime).toLocaleDateString()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Time: {new Date(item.dateTime).toLocaleTimeString()}</Text>
              </View>

              {/* Available Spots */}
              <View style={styles.row}>
                <Text style={styles.label}>Spots Left: {item.maxSpots - item.participants.length}/{item.maxSpots}</Text>
              </View>

              {/* Points */}
              <View style={styles.row}>
                <Text style={styles.eventPoints}>Points: 10</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              {/* <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => router.push(`/events/${item.id}`)}
              >
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => openModal(item)}
              >
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Sign Up Modal */}
      {selectedEvent && (
        <SignUpModal
          visible={modalVisible}
          eventName={selectedEvent.eventName}
          userData={{
            name: session?.user.fullName ?? '',
            email: session?.user.email ?? '',
          }}
          onClose={closeModal}
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
    backgroundColor: '#F5FFF0', // Light green background to match the design
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2E7D32', // Dark green header text
  },
  card: {
    backgroundColor: '#FFFFFF', // White card background
    borderRadius: 16, // Rounded corners
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Subtle shadow for depth
    padding: 16,
  },
  image: {
    width: '100%',
    height: 150, // Adjusted height
    backgroundColor: '#C8E6C9', // Placeholder color for missing images
    resizeMode: 'cover',
    borderRadius: 16, // Rounded corners
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Dark green
    marginBottom: 16,
    textAlign: 'center', // Center the event title
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000', // Dark green
  },
  value: {
    fontSize: 14,
    color: '#444', // Neutral color for values
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  detailsButton: {
    backgroundColor: '#81C784', // Green button
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  signupButton: {
    backgroundColor: '#2E7D32', // Darker green button
    width: '80%',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    textAlign: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A5D6A7', // Placeholder green for avatar
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  location: {
    fontSize: 14,
    color: '#000',
  },
  eventDetails: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  eventTime: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  eventPoints: {
    fontWeight: 'bold',
    color: '#FF6F00', // Orange for points
  },
});
