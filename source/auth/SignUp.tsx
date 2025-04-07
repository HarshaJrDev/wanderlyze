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
import { AuthStackParamList } from '../../types';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingOverlay from '../components/LoadingOverlay';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../constants/Colors';
import { fonts } from '../utils/fonts';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    age?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { signUp } = useAuth();

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!username) newErrors.username = 'Username is required';
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!age) newErrors.age = 'Age is required';
    else if (isNaN(Number(age)) || Number(age) < 1) newErrors.age = 'Age must be a valid number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    const { error } = await signUp({
      username,
      email,
      password,
      gender,
      age: Number(age),
    });
    setIsLoading(false);
    
    if (error) {
      alert(error.message);
    } else {
      alert('Sign up successful!');
      navigation.navigate('SignIn');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.header}>
          <Title style={styles.title}>Create Account</Title>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={300} duration={1000} style={styles.form}>
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            autoCapitalize="none"
            left={<PaperInput.Icon icon="account" />}
          />

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

          <Input
            label="Age"
            value={age}
            onChangeText={setAge}
            error={errors.age}
            keyboardType="number-pad"
            left={<PaperInput.Icon icon="calendar" />}
          />

          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <RadioButton.Group
              onValueChange={(value) => setGender(value as 'male' | 'female' | 'other')}
              value={gender}
            >
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="male" color={COLORS.primary} />
                  <Text style={styles.radioLabel}>Male</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="female" color={COLORS.primary} />
                  <Text style={styles.radioLabel}>Female</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="other" color={COLORS.primary} />
                  <Text style={styles.radioLabel}>Other</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <Button onPress={handleSignUp} style={styles.button}>
            Sign Up
          </Button>
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={600} duration={1000} style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      <LoadingOverlay visible={isLoading} message="Creating account..." />
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
  },
  header: {
    marginVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: COLORS.textLight,
  },
  form: {
    width: '100%',
  },
  genderContainer: {
    marginVertical: 10,
  },
  genderLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  radioLabel: {
    fontFamily: fonts.regular,
  },
  button: {
    marginTop: 20,
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontFamily: fonts.regular,
    marginRight: 5,
  },
  link: {
    fontFamily: fonts.medium,
    color: COLORS.primary,
  },
});

export default SignUp;
