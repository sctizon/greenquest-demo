import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../contexts/ctx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import HomeTab from './home';
import CreateEventTab from './create';
import ProfileTab from './profile';

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'home') {
            iconName = 'home';
          } else if (route.name === 'create') {
            iconName = 'add-circle';
          } else if (route.name === 'profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#2E7D32', // Green for active tabs
        tabBarInactiveTintColor: 'gray', // Gray for inactive tabs
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // White background
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0', // Light gray border
        },
        headerShown: false, // Hide headers for each screen
      })}
    >
      {/* Home Tab */}
      <Tab.Screen name="home" component={HomeTab} />

      {/* Create Tab */}
      <Tab.Screen name="create" component={CreateEventTab} />

      {/* Profile Tab */}
      <Tab.Screen name="profile" component={ProfileTab} />
    </Tab.Navigator>
  );
}
