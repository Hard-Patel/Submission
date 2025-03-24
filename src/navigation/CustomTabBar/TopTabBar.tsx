/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import {useAppTheme} from '../../theme';
import {TouchableOpacity, Text} from 'react-native';

export function MyTabBar(props: any) {
  const theme = useAppTheme();
  const {state, descriptors, navigation, position} = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.white[900],
        width: '100%',
        borderRadius: 10,
        padding: 2,
        marginTop: 10,
      }}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            key={`${index}`}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isFocused
                ? theme.colors.primary[900]
                : theme.colors.white[900],
              paddingVertical: 12,
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: isFocused
                  ? theme.colors.white[900]
                  : theme.colors.text[800],
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
