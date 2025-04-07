import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/Colors';
import { fonts } from '../utils/fonts';

const ProfileItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: string;
}) => {
  return (
    <View style={styles.item}>
      {icon && <Icon name={icon} size={20} color={COLORS.primary} style={styles.icon} />}
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontFamily: fonts.medium,
    color: COLORS.textLight,
  },
  value: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: COLORS.text,
  },
});

export default ProfileItem;
