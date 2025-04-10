import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../types';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import OnBoardScreen from '../screens/OnBoardScreen/OnBoardScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='HomeScreen'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="OnBoardScreen" component={OnBoardScreen} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;