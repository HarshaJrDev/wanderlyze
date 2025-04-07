import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, Title, RadioButton, TextInput as PaperInput } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingOverlay from '../components/LoadingOverlay';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/Colors';
import { fonts } from '../utils/fonts';

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<SignInScreenNavigationProp>();
  const { signIn } = useAuth();

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

    if (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.header}>
          <View style={styles.headerRow}>
            <Icon name="account-circle-outline" size={28} color={COLORS.primary} style={styles.headerIcon} />
            <Title style={styles.title}>Welcome Back!</Title>
          </View>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={300} duration={1000} style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<PaperInput.Icon icon="email-outline" />}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry={!showPassword}
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

        <Animatable.View animation="fadeIn" delay={600} duration={1000} style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={styles.footerLinkContainer}
          >
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: COLORS.primary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.regular,
    marginRight: 5,
  },
  footerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 4,
  },
  link: {
    fontFamily: fonts.medium,
    color: COLORS.primary,
  },
});

export default SignIn;
