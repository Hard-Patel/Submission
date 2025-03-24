import {TextStyle} from 'react-native';
import {fontFamily, useAppTheme} from 'theme';

export const useStyleUtils = () => {
  const theme = useAppTheme();
  const headerTitleStyle: Pick<
    TextStyle,
    'fontFamily' | 'fontSize' | 'fontWeight' | 'letterSpacing'
  > & {
    color?: string;
  } = {
    color: theme.colors.gray[900],
    fontFamily: fontFamily.medium,
    fontSize: 18,
    letterSpacing: 0.3,
    fontWeight: '500',
  };

  return {headerTitleStyle};
};
