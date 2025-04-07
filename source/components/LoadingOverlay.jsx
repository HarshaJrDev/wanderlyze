import React from 'react';
import { StyleSheet, View, ActivityIndicator, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../constants/Colors';
import { fonts } from '../utils/fonts';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  message: {
    marginTop: 10,
    fontFamily: fonts.regular,
    color: COLORS.text,
  },
});

export default LoadingOverlay;