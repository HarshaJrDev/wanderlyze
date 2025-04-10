import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import Planner from '../../source/screens/HomeScreen/HomeScreen';
import Itinerary from '../../source/screens/ItineraryScreen/ItineraryScreen';
import Explore from '../../source/screens/ExploreScreen/ExploreScreen';
import Weather from '../../source/screens/WeatherScreen/WeatherScreen';
import Profile from '../screens/./../main/Profile';
import EditProfile from '../main/EditProfile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
  </Stack.Navigator>
);

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0b5cff',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Planner':
              iconName = 'sparkles-outline';
              break;
            case 'Itinerary':
              iconName = 'calendar-outline';
              break;
            case 'Explore':
              iconName = 'compass-outline';
              break;
            case 'Weather':
              iconName = 'cloud-outline';
              break;
            case 'ProfileTab':
              iconName = 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Planner" component={Planner} />
      <Tab.Screen name="Itinerary" component={Itinerary} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Weather" component={Weather} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
