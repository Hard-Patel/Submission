/**
 * @format
 */
import React from 'react';
import {Text, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {AppTheme} from '../../theme';
import {SvgProps} from 'react-native-svg';
import {TouchableOpacity} from 'react-native';

type IconType = (props: SvgProps) => Element;

interface Props extends IViewProps {
  theme: AppTheme;
  title: string;
  onPress: () => void;
  onLongPress: () => void;
  icon: (focused: boolean) => JSX.Element | IconType | undefined;
  focused: boolean;
  titleName: string;
}

export function TabIcon(props: Props) {
  const {
    theme,
    title,
    onPress,
    onLongPress,
    icon,
    focused,
    titleName,
    ...rest
  } = props;

  return (
    <TouchableOpacity onLongPress={onLongPress} onPress={onPress}>
      <View
        alignItems="center"
        height="50"
        justifyContent="flex-start"
        pt={0.5}
        width="100%"
        {...rest}>
        {focused && (
          <View
            backgroundColor={theme.colors.primary[900]}
            height="2px"
            position="absolute"
            top={-8}
            width="100%"
          />
        )}
        {icon(focused)}
        <Text
          color={focused ? theme.colors.primary[900] : theme.colors.text[800]}
          fontSize="12px"
          textAlign={'center'}
          // letterSpacing={0.3}
          // lineHeight="24px"
          mt={1}
          numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
