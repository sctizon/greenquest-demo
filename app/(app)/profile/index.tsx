import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { useSession } from '../../../contexts/ctx';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from 'expo-router';
import { API_URL } from '@/constants/constants';

export default function ProfilePage() {
  const { session } = useSession(); // Access the user's session
  const [profileData, setProfileData] = useState({
    eventsParticipated: 0,
    eventsCreated: 0,
    wasteCollected: 0, // Assume this comes from your backend
    badges: [], // Example for badges
    prizes: [], // Example for prizes
  });
  const { signOut } = useSession();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // State for logout modal visibility

  const confirmLogout = () => {
    setLogoutModalVisible(true); // Show the logout confirmation modal
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    signOut(); // Clear the session
    router.replace('/auth/sign-in'); // Redirect to sign-in page
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (session?.token) {
          const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          } else {
            console.error('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [session]);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Picture and Username */}
      <View style={styles.profileHeader}>
        <View style={styles.profilePictureContainer}>
          <Image
            source={{
              uri: 'https://via.placeholder.com/100', // Replace with actual profile picture URL
            }}
            style={styles.profilePicture}
          />
        </View>
        <Text style={styles.username}>{session?.user?.fullName || 'Username'}</Text>
        <TouchableOpacity 
            style={styles.optionsButton}
            onPress={() => setMenuVisible((prev) => !prev)} // Toggle menu visibility
        >
            <SimpleLineIcons name="options-vertical" size={24} color="#2E7D32" />
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {menuVisible && (
            <View style={styles.menu}>
                <TouchableOpacity
                    style={styles.menuItem}
                    // onPress={handleViewPersonalData}
                >
                    <Text style={styles.menuItemText}>Personal Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.menuItem, styles.logoutItem]}
                    onPress={confirmLogout}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        )}
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent={true}
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profileData.eventsParticipated}</Text>
          <Text style={styles.statLabel}>Events participated</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profileData.eventsCreated}</Text>
          <Text style={styles.statLabel}>Events created</Text>
        </View>
        {/* <View style={styles.statItem}>
          <Text style={styles.statValue}>{profileData.wasteCollected} kg</Text>
          <Text style={styles.statLabel}>Waste collected</Text>
        </View> */}
      </View>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgesContainer}>
          {/* {profileData.badges.length > 0 ? (
            profileData.badges.map((badge, index) => (
              <Image
                key={index}
                source={{ uri: badge.image }} // Replace with actual badge image URL
                style={styles.badge}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>No badges earned yet.</Text>
          )} */}
        </View>
        <Text style={styles.noDataText}>Soon Available</Text>
      </View>

      {/* Prizes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prizes</Text>
        {/* {profileData.prizes.length > 0 ? (
          profileData.prizes.map((prize, index) => (
            <View key={index} style={styles.prizeItem}>
              <Text style={styles.prizeText}>{prize}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No prizes earned yet.</Text>
        )} */}
        <Text style={styles.noDataText}>Soon Available</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF8E6', // Light green background
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000', // Shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  optionsButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  optionsText: {
    fontSize: 18,
    color: '#222',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 14,
    color: '#222',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badge: {
    width: 60,
    height: 60,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#ccc', // Placeholder color
  },
  noDataText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  prizeItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  prizeText: {
    fontSize: 16,
    color: '#222',
  },
  menu: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 9, // Ensures the menu appears above other components
    gap: 10,
  },
  menuItem: {
    padding: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  logoutItem: {
    // backgroundColor: '#990f02',
    // borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#b90e0a', //crimsom red
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: Dimensions.get('window').width * 0.8, // Responsive width
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
