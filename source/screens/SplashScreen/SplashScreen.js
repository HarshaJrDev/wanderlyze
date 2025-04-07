import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants/Colors';
import { fonts } from '../../utils/fonts';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Navigate to OnBoardScreen after 1 second
      const timer = setTimeout(() => {
        navigation.navigate('OnBoardScreen');
      }, 1000);

      // Cleanup the timer on unmount
      return () => clearTimeout(timer);
    });
  }, [fadeAnim, scaleAnim, textFadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../assets/images/SplashIcon.png')}
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.Text style={[styles.label, { opacity: textFadeAnim }]}>
        Your AI Assistant for Everyday Life
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundSplash,
  },
  imageContainer: {
    height: SCREEN_HEIGHT * 0.5,
    width: SCREEN_WIDTH * 0.5,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  label: {
    color: COLORS.surface,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: fonts.regular,
    paddingHorizontal: 20,
  },
});