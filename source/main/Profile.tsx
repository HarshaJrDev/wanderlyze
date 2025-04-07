import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Avatar, Card, Text, IconButton } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/index';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import ProfileItem from '../components/ProfileItem';
import Button from '../components/Button';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/Colors';
import { fonts } from '../utils/fonts';

type ProfileScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Profile'>;

const Profile = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut, refreshUser } = useAuth();

  useFocusEffect(
    useCallback(() => {
      refreshUser?.();
    }, [])
  );

  if (!user) return null;

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Profile"
        action={{
          icon: 'logout',
          onPress: signOut,
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View
          animation="fadeIn"
          duration={800}
          style={styles.avatarContainer}
        >
          <Avatar.Text
            size={100}
            label={getInitials(user.username)}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={800}
          style={styles.usernameContainer}
        >
          <Icon name="account-circle-outline" size={22} color={COLORS.primary} />
          <Text style={styles.username}>{user.username}</Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={200}
          duration={800}
        >
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <IconButton
                  icon="pencil"
                  size={20}
                  color={COLORS.primary}
                  onPress={() => navigation.navigate('EditProfile')}
                />
              </View>

              <ProfileItem
                icon="account-outline"
                label="Username"
                value={user.username}
              />
              <ProfileItem
                icon="email-outline"
                label="Email"
                value={user.email}
              />
              <ProfileItem
                icon="gender-male-female"
                label="Gender"
                value={user.gender}
              />
              <ProfileItem
                icon="calendar-account"
                label="Age"
                value={user.age}
              />
            </Card.Content>
          </Card>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={400}
          duration={800}
          style={styles.buttonContainer}
        >
          <Button onPress={() => navigation.navigate('EditProfile')}>
            <View style={styles.editButtonContent}>
              <Icon name="account-edit-outline" size={18} color="#fff" style={styles.editButtonIcon} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </View>
          </Button>
        </Animatable.View>
      </ScrollView>
    </View>
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
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  avatarLabel: {
    fontFamily: fonts.bold,
  },
  usernameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginBottom: 20,
  },
  username: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: COLORS.text,
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: COLORS.primary,
  },
  buttonContainer: {
    marginTop: 10,
  },
  editButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonIcon: {
    marginRight: 6,
  },
  editButtonText: {
    fontFamily: fonts.medium,
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
