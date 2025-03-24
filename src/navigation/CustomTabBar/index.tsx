/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootTabParamList} from '../../interface/navigation';
import {TabIcon} from './TabIcon';
import {AppTheme, useAppTheme} from '../../theme';
import {useTranslation} from 'react-i18next';
import {
  DeviceControlFilledIcon,
  DeviceControlIcon,
  DeviceListFilledIcon,
  DeviceListIcon,
  SettingsFilledIcon,
  SettingsIcon,
  UsersFilledIcon,
  UsersIcon,
} from '../../assets/svg';

const getIcon = (
  screen: keyof RootTabParamList,
  theme: AppTheme,
  focused: boolean,
) => {
  switch (screen) {
    case 'DeviceControlTab':
      return focused ? (
        <DeviceControlFilledIcon color={theme.colors.primary[900]} />
      ) : (
        <DeviceControlIcon color={theme.colors.icon[900]} />
      );
    case 'UserList':
      return focused ? (
        <UsersFilledIcon color={theme.colors.primary[900]} />
      ) : (
        <UsersIcon color={theme.colors.icon[900]} />
      );
    case 'DeviceList':
      return focused ? (
        <DeviceListFilledIcon color={theme.colors.primary[900]} />
      ) : (
        <DeviceListIcon color={theme.colors.icon[900]} />
      );
    case 'Settings':
      return focused ? (
        <SettingsFilledIcon color={theme.colors.primary[900]} />
      ) : (
        <SettingsIcon color={theme.colors.icon[900]} />
      );
    default:
      return undefined;
  }
};

const getName = (screen: keyof RootTabParamList): string => {
  switch (screen) {
    case 'DeviceControlTab':
      return 'Control';
    case 'UserList':
      return 'Users';
    case 'DeviceList':
      return 'Devices';
    case 'Settings':
      return 'Settings';
    default:
      return '';
  }
};

function Tabs(props: BottomTabBarProps) {
  const {state, descriptors, navigation} = props;

  const theme = useAppTheme();
  const {t} = useTranslation();

  return (
    <>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const focused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            const {name} = route;
            navigation.navigate({name, merge: true, params: route.params});
          }
        };

        const onLongPress = () =>
          navigation.emit({type: 'tabLongPress', target: route.key});

        if (options.tabBarButton) {
          return options.tabBarButton({children: null});
        }

        const getIconOftab = (focused: boolean) =>
          getIcon(route.name as keyof RootTabParamList, theme, focused);
        const getNameOftab = (name: string) =>
          getName(name as keyof RootTabParamList);

        return (
          <View key={route.key}>
            <TabIcon
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityRole="button"
              accessibilityState={focused ? {selected: true} : {}}
              focused={focused}
              icon={getIconOftab}
              key={route.key}
              mt={2}
              testID={options.tabBarTestID}
              theme={theme}
              titleName={route.name}
              title={getNameOftab(`${route.name}`)}
              width="80px"
              onLongPress={onLongPress}
              onPress={onPress}
            />
          </View>
        );
      })}
    </>
  );
}

function CustomTabBar(props: BottomTabBarProps) {
  const theme = useAppTheme();

  const insets = useSafeAreaInsets();

  return (
    <View
      alignItems="center"
      backgroundColor={theme.colors.background[950]}
      bottom={0}
      flexDirection="row"
      justifyContent="space-evenly"
      left={0}
      paddingRight={2}
      paddingBottom={insets.bottom}
      position="absolute"
      right={0}>
      <Tabs {...props} />
    </View>
  );
}

export default CustomTabBar;
