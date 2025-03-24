/**
 * @format
 */
import {extendTheme} from 'native-base';
import {fonts, fontConfig} from './common';

const colors = {
  primary: {
    950: '#E83030',
    900: '#FF7032',
    800: '#E83030',
    700: '#FF7032',
    600: '#0B7202',
  },
  white: {
    900: '#FFFFFF',
  },
  background: {
    950: '#FFFFFF',
    900: '#F5F5F5',
    800: '#F8FAFB',
    700: '#C4C4C4',
    600: '#DDDDDD',
  },
  green: {
    900: '#01C309',
  },
  state: {
    success: '#11D200',
    failure: '#E83030',
  },
  border: {
    900: '#E8E8E8',
    800: '#DDDDDD',
    700: '#222222',
  },
  black: {
    900: '#000000',
    850: '#0D0D0D',
    800: '#3C3C3C',
    700: '#181818',
  },
  message: {
    900: '#2196F3', // Info
    800: '#E80049', // Error
    700: '#FFCA28', // Warning
    600: '#4CAF50', // Success
  },
  gray: {
    900: '#222222',
    800: '#666666',
    700: '#999999',
    600: '#E8E8E8',
    500: '#B6B8BA',
    400: '#F8F7F7',
  },
  text: {
    950: '#000000',
    900: '#222222',
    800: '#888888',
    850: '#666666',
    700: '#555555',
  },
  icon: {
    900: '#767676',
    200: '#C2C2C2',
  },
  reverseText: {
    900: '#ffffff',
  },
  transparent: 'rgba(255,255,255,0)',
};

export const lightTheme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },
  colors,
  fontConfig,
  fonts,
});

export type AppTheme = typeof lightTheme;
