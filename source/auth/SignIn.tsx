// SignIn.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Image,
} from 'react-native';
import { Text, TextInput as PaperInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingOverlay from '../components/LoadingOverlay';
import { COLORS, SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants/Colors';
import { fonts } from '../utils/fonts';

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

const SignIn = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

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
    });
  }, [fadeAnim, scaleAnim, textFadeAnim]);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) Alert.alert(error.message);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <Animated.Image
            source={require('../../assets/images/SplashIcon.png')}
            style={[
              styles.image,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          <Animated.Text style={[styles.subtitle, { opacity: textFadeAnim }]}>
            Sign in to continue
          </Animated.Text>
        </Animatable.View>

        {/* Highlights */}
        <View style={styles.highlightsContainer}>
          {[
            { icon: 'shield-lock-outline', label: 'Secure Login' },
            { icon: 'rocket-launch-outline', label: 'Fast Performance' },
            { icon: 'account-multiple-outline', label: 'Trusted by Thousands' },
          ].map((item, index) => (
            <View key={index} style={styles.highlightItem}>
              <Icon name={item.icon} size={20} color={COLORS.primary} />
              <Text style={styles.highlightText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Form */}
        <Animatable.View animation="fadeInUp" delay={300} duration={1000} style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            textColor="#fff"
            left={<PaperInput.Icon icon="email-outline" />}
          />

          <Text style={styles.label}>Password</Text>
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry={!showPassword}
            textColor="#fff"
            left={<PaperInput.Icon icon="lock-outline" />}
            right={
              <PaperInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button onPress={handleSignIn} style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="login-variant" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Sign In</Text>
            </View>
          </Button>
        </Animatable.View>

        {/* Footer */}
        <Animatable.View animation="fadeIn" delay={600} duration={1000} style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.footerLinkContainer}>
            <Icon name="account-plus-outline" size={16} color={COLORS.primary} style={styles.footerIcon} />
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      <LoadingOverlay visible={isLoading} message="Signing in..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark modern background
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: '#CBD5E1',
    marginTop: 8,
  },
  image: {
    height: SCREEN_HEIGHT * 0.22,
    width: SCREEN_WIDTH * 0.5,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  highlightsContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  highlightText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: '#F8FAFC',
  },
  form: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: '#F1F5F9',
    marginTop: 10,
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontFamily: fonts.medium,
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: fonts.regular,
    color: '#CBD5E1',
    fontSize: 14,
  },
  footerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  footerIcon: {
    marginRight: 4,
  },
  link: {
    fontFamily: fonts.medium,
    color: '#38BDF8',
    fontSize: 14,
  },
});

export default SignIn;
