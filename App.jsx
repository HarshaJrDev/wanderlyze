import 'react-native-reanimated'; 
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from './source/hooks/useAuth';
import AuthNavigator from './source/navigation/AuthNavigator';
import AppNavigator from './source/navigation/AppNavigator';
import LoadingOverlay from './source/components/LoadingOverlay';
import { PaperProvider } from 'react-native-paper';
import { COLORS } from './source/constants/Colors';
import { fonts } from './source/utils/fonts';

const Navigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading..." />;
  }



  return (
    <PaperProvider>
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Navigation;
