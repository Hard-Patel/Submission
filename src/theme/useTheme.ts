/**
 * @format
 */
import {
  initThemeProvider,
  useStyle,
} from '@pavelgric/react-native-theme-provider';

import {darkTheme} from './darkTheme';
import {lightTheme} from './lightTheme';
import {StorageKeys, storage} from '../constants';

export const themes = {dark: darkTheme, light: lightTheme};

export type Themes = typeof themes;
const currentTheme: any = storage.getString(StorageKeys.THEME);
export const {
  createUseStyle,
  createStyle,
  useTheme,
  useThemeDispatch,
  ThemeProvider,
} = initThemeProvider({themes, initialTheme: currentTheme ?? 'light'});

const useAppThemeName = () => {
  const {selectedTheme} = useTheme();
  return selectedTheme;
};

const useAppTheme = () => {
  const {selectedTheme} = useTheme();
  const appTheme = themes[selectedTheme];
  return appTheme;
};

const useSetAppTheme = () => {
  const {setTheme} = useThemeDispatch();
  return {setTheme};
};

const useToggleTheme = () => {
  const {selectedTheme} = useTheme();
  const {setTheme} = useThemeDispatch();
  const toggleTheme = () => {
    setTheme(selectedTheme === 'light' ? 'dark' : 'light');
  };
  return {toggleTheme};
};

export {useStyle, useAppThemeName, useAppTheme, useSetAppTheme, useToggleTheme};
