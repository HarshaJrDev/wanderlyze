import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, RadioButton, TextInput, List } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingOverlay from '../components/LoadingOverlay';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../constants/Colors';
import { fonts } from '../utils/fonts';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    age?: string;
  }>({});

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setGender(user.gender as 'male' | 'female' | 'other');
      setAge(user.age.toString());
    }
  }, [user]);

  const validate = () => {
    const newErrors: {
      username?: string;
      age?: string;
    } = {};

    if (!username) newErrors.username = 'Username is required';

    if (!age) newErrors.age = 'Age is required';
    else if (isNaN(Number(age)) || Number(age) < 1)
      newErrors.age = 'Age must be a valid number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);
    const { error } = await updateProfile({
      username,
      gender,
      age: Number(age),
    });
    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Profile updated successfully');
      navigation.goBack();
    }
  };

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Edit Profile" back />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="fadeInUp" duration={800} style={styles.form}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            icon="account"
          />

          <Input
            label="Email"
            value={user.email}
            onChangeText={() => {}}
            disabled
            icon="email"
          />

          <Input
            label="Age"
            value={age}
            onChangeText={setAge}
            error={errors.age}
            keyboardType="number-pad"
            icon="calendar"
          />

          <View style={styles.genderContainer}>
            <View style={styles.genderLabelRow}>
              <List.Icon icon="gender-male-female" color={COLORS.primary} />
              <Text style={styles.genderLabel}>Gender</Text>
            </View>

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

          <Button onPress={handleSave} style={styles.button}>
            Save Changes
          </Button>
        </Animatable.View>
      </ScrollView>

      <LoadingOverlay visible={isLoading} message="Updating profile..." />
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
  form: {
    width: '100%',
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 20,
  },
  genderContainer: {
    marginVertical: 10,
  },
  genderLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  genderLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: COLORS.textLight,
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
    marginTop: 30,
  },
});

export default EditProfile;
