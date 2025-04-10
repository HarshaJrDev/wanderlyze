import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, TextInput as PaperInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingOverlay from '../components/LoadingOverlay';
import { COLORS } from '../constants/Colors';
import { fonts } from '../utils/fonts';
import { useAuth } from '../hooks/useAuth';
import PickerInput from '../components/PickerInput';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUp = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [destination, setDestination] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !name || !age || !gender) {
      Alert.alert('All fields are required');
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email, password, {
      name,
      age,
      gender,
      destination,
      travelStyle,
    });
    setIsLoading(false);
    if (error) Alert.alert(error.message);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <Icon name="account-plus" size={64} color={COLORS.primary} />
          <Text style={styles.subtitle}>Create your travel account</Text>
        </Animatable.View>

        {/* Form */}
        <Animatable.View animation="fadeInUp" delay={300} duration={1000} style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            left={<PaperInput.Icon icon="account-outline" />}
          />

          <Text style={styles.label}>Email Address</Text>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<PaperInput.Icon icon="email-outline" />}
          />

          <Text style={styles.label}>Password</Text>
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            left={<PaperInput.Icon icon="lock-outline" />}
          />

          <PickerInput
            label="Age Group"
            selectedValue={age}
            onValueChange={(val) => setAge(val)}
            icon="calendar-account"
            items={[
              { label: 'Select Age Group', value: '' },
              { label: '18-25', value: '18-25' },
              { label: '26-35', value: '26-35' },
              { label: '36-50', value: '36-50' },
              { label: '50+', value: '50+' },
            ]}
          />

          <Text style={styles.label}>Gender</Text>
          <Input
            label="Gender"
            value={gender}
            onChangeText={setGender}
            left={<PaperInput.Icon icon="gender-male-female" />}
          />

          <Text style={styles.label}>Preferred Destination</Text>
          <Input
            label="Destination"
            value={destination}
            onChangeText={setDestination}
            left={<PaperInput.Icon icon="map-marker-radius-outline" />}
          />

          <PickerInput
            label="Preferred Travel Style"
            selectedValue={travelStyle}
            onValueChange={(val) => setTravelStyle(val)}
            icon="bag-suitcase-outline"
            items={[
              { label: 'Select Travel Style', value: '' },
              { label: 'Solo', value: 'solo' },
              { label: 'Family', value: 'family' },
              { label: 'Adventure', value: 'adventure' },
              { label: 'Luxury', value: 'luxury' },
            ]}
          />

          <Button onPress={handleSignUp} style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="check-bold" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Create Account</Text>
            </View>
          </Button>
        </Animatable.View>

        {/* Footer */}
        <Animatable.View animation="fadeIn" delay={600} duration={1000} style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            style={styles.footerLinkContainer}
          >
            <Icon name="login" size={16} color={COLORS.primary} style={styles.footerIcon} />
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      <LoadingOverlay visible={isLoading} message="Signing up..." />
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
    color: COLORS.textLight,
    marginTop: 8,
  },
  form: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: COLORS.textDark,
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
    color: COLORS.textLight,
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
    color: COLORS.textDark,
    fontSize: 14,
  },
});

export default SignUp;
