// components/PickerInput.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, Text, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/Colors';
import { fonts } from '../utils/fonts';

type PickerItem = { label: string; value: string };

interface Props {
  label: string;
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  items: PickerItem[];
  icon?: string;
}

const PickerInput = ({ label, selectedValue, onValueChange, items, icon }: Props) => {
  const [visible, setVisible] = useState(false);
  const selectedLabel = items.find(item => item.value === selectedValue)?.label || 'Select';

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableRipple onPress={openMenu} style={styles.pickerWrapper} rippleColor="rgba(255,255,255,0.2)">
            <View style={styles.row}>
              {icon && <Icon name={icon} size={20} color={COLORS.primary} style={styles.icon} />}
              <Text style={styles.selectedText}>{selectedLabel}</Text>
              <Icon name="chevron-down" size={20} color={COLORS.primary} style={styles.chevron} />
            </View>
          </TouchableRipple>
        }
        contentStyle={styles.menuContent}
      >
        {items.map(item => (
          <Menu.Item
            key={item.value}
            title={item.label}
            onPress={() => {
              onValueChange(item.value);
              closeMenu();
            }}
            titleStyle={styles.menuItem}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fonts.medium,
    color: COLORS.textDark,
    fontSize: 14,
    marginBottom: 4,
  },
  pickerWrapper: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    flex: 1,
    color: COLORS.textLight,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  icon: {
    marginRight: 8,
  },
  chevron: {
    marginLeft: 8,
  },
  menuItem: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: COLORS.textDark,
  },
  menuContent: {
    backgroundColor: '#1E293B',
  },
});

export default PickerInput;
