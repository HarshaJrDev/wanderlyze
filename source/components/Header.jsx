import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { fonts } from '../utils/fonts';

interface HeaderProps {
  title: string;
  back?: boolean;
  action?: {
    icon: string;
    onPress: () => void;
  };
}

const Header: React.FC<HeaderProps> = ({ title, back = false, action }) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={styles.header}>
      {back && <Appbar.BackAction onPress={() => navigation.goBack()} />}
      <Appbar.Content title={title} titleStyle={styles.title} />
      {action && (
        <Appbar.Action icon={action.icon} onPress={action.onPress} />
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
  },
  title: {
    fontFamily: fonts.medium,
  },
});

export default Header;
