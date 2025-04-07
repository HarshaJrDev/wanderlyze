import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, HelperText, TextInputProps } from 'react-native-paper';
import { COLORS } from '../constants/Colors';
import { fonts } from '../utils/fonts';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: object;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  disabled = false,
  left,
  right,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        mode="outlined"
        error={!!error}
        disabled={disabled}
        left={left}
        right={right}
        theme={{
          fonts: { regular: { fontFamily: fonts.regular } },
          colors: { primary: COLORS.primary },
        }}
        style={styles.input}
      />
      {error ? <HelperText type="error">{error}</HelperText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
  },
});

export default Input;
