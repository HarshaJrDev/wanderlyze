import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { fonts } from '../utils/fonts';
import { COLORS } from '../constants/Colors';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
  style?: object;
  labelStyle?: object;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  onPress,
  loading = false,
  disabled = false,
  color = COLORS.primary,
  style,
  labelStyle,
  children,
}) => {
  return (
    <View style={styles.container}>
      <PaperButton
        mode={mode}
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        color={color}
        style={[styles.button, style]}
        labelStyle={[styles.label, labelStyle]}
      >
        {children}
      </PaperButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 6,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});

export default Button;
