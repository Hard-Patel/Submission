/**
 * @format
 */
import React from 'react';
import {Text, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {AppTheme} from '../../theme';
import {TouchableOpacity} from 'react-native';

interface Props extends IViewProps {
  theme: AppTheme;
  title: string;
  onPress: () => void;
  onLongPress: () => void;
  focused: boolean;
  titleName: string;
}

export function TopTabIcon(props: Props) {
  const {
    theme,
    title,
    onPress,
    onLongPress,
    focused,
    titleName,
    ...rest
  } = props;

  return (
    <TouchableOpacity onLongPress={onLongPress} onPress={onPress}>
      <View
        alignItems="center"
        height="60"
        justifyContent="flex-start"
        {...rest}>
        <Text
          color={focused ? theme.colors.primary[900] : theme.colors.text[800]}
          fontSize="12px"
          textAlign={'center'}
          numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
