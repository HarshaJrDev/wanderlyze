import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PaperProvider } from 'react-native-paper';

// Hooks and utilities
import { useAuth } from './source/hooks/useAuth';
import LoadingOverlay from './source/components/LoadingOverlay';

// Auth Screens
import SignIn from './source/auth/SignIn';
import SignUp from './source/auth/SignUp';
import SplashScreen from './source/screens/SplashScreen/SplashScreen';
import OnBoardScreen from './source/screens/OnBoardScreen/OnBoardScreen';
import HomeScreen from './source/screens/HomeScreen/HomeScreen'; // used in auth

// Main Screens
import Itinerary from './source/screens/ItineraryScreen/ItineraryScreen';
import Explore from './source/screens/ExploreScreen/ExploreScreen';
import Weather from './source/screens/WeatherScreen/WeatherScreen';
import Profile from './source/main/Profile';
import EditProfile from './source/main/EditProfile';

// Stack and Tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
    <Stack.Screen name="OnBoardScreen" component={OnBoardScreen} />

  </Stack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={Profile} />
    <ProfileStack.Screen name="EditProfile" component={EditProfile} />
  </ProfileStack.Navigator>
);

const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#0b5cff',
      tabBarInactiveTintColor: 'gray',
      tabBarLabelStyle: { fontSize: 12 },
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        switch (route.name) {
          case 'HomeScreen':
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
    <Tab.Screen name="HomeScreen" component={HomeScreen} />
    <Tab.Screen name="Itinerary" component={Itinerary} />
    <Tab.Screen name="Explore" component={Explore} />
    <Tab.Screen name="Weather" component={Weather} />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStackNavigator}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

const Navigation = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        {user ? <BottomTabs /> : <AuthNavigator />}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Navigation;
