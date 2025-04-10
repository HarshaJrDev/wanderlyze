import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const COLORS = {
  backgroundSplash:"#000",
  primaryDark: '#3700B3',
  primary: '#0F172A',        // deep navy/black
  secondary: '#1E293B',      // dark blue-gray
  accent: '#38BDF8',         // futuristic light blue
  white: '#FFFFFF',
  gray: '#94A3B8',
  background: '#0F172A',
  lightGlass: 'rgba(255, 255, 255, 0.08)',
  borderGlass: 'rgba(255, 255, 255, 0.15)',
  textDark: '#F8FAFC',      // bright white for primary text
  textLight: '#CBD5E1',     // Medium gray, good for subtitles or hints
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  border: '#E5E7EB',
};
