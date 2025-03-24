import React, {useContext} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SCREEN_WIDTH} from '../constants';
import {ActiveDeviceList} from 'screens/DeviceControlList/ActiveDevice';
import {InactiveDeviceList} from 'screens/DeviceControlList/InactiveDeviceList';
import {MyTabBar} from './CustomTabBar/TopTabBar';
import {RootTabScreenProps} from 'interface/navigation';
import {fontFamily, useAppTheme} from 'theme';
import {useStyleUtils} from 'hooks';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {CloseIcon, SearchtoptabIcon} from 'assets/svg';
import {SearchContext} from '../Providers/SearchContext';
import { useDebounceValue } from 'hooks/useDebounceValue';

const Tab = createMaterialTopTabNavigator();

export function DeviceListTopTabBarScreen(
  props: RootTabScreenProps<'DeviceList'>,
) {
  const {navigation} = props;
  const theme = useAppTheme();
  const {headerTitleStyle} = useStyleUtils();
  const [search, setSearch] = React.useState<boolean>(false);
  const [searchLocal, setSearchLocal] = React.useState<string>('');
  const {searchFilter, setSearchFilter} = useContext(SearchContext);
  const debouncedSearch = useDebounceValue(searchLocal, 500)
  
  React.useEffect(() => {
    setSearchFilter(debouncedSearch);
  }, [debouncedSearch, searchFilter])

  const SearchComponent = React.useCallback(
    ({value, setValue}: {value: string; setValue: (text: string) => void}) => {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: SCREEN_WIDTH * 0.8,
            height: 50,
            borderRadius: 8,
            borderWidth: 1,
            marginHorizontal: 16,
            borderColor: theme.colors.border[900],
            backgroundColor: theme.colors.background[950],
          }}>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Try search device with name or IMEI."
            style={{
              paddingHorizontal: 12,
              fontSize: 14,
              textAlignVertical: 'center',
              color: theme.colors.text[900],
              fontFamily: fontFamily.regular,
              width: '90%',
            }}
            placeholderTextColor={theme.colors.text[800]}
          />
          <TouchableOpacity
            onPress={() => {
              setValue('');
            }}
            style={{marginTop: -3}}>
            <CloseIcon height={18} width={18} />
          </TouchableOpacity>
        </View>
      );
    },
    [],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerTitle: search ? '' : 'Device List',
      headerLeft: () =>
        search ? (
          <SearchComponent
            value={searchLocal}
            setValue={text => setSearchLocal(text)}
          />
        ) : (
          <></>
        ),
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{marginRight: 18}}
            onPress={() => {
              setSearchLocal('')
              setSearch(!search);
            }}>
            {search ? <CloseIcon /> : <SearchtoptabIcon />}
          </TouchableOpacity>
        );
      },
    });
  }, [theme, searchFilter, navigation, headerTitleStyle]);

  return (
    <Tab.Navigator
      style={{width: SCREEN_WIDTH * 0.9, alignSelf: 'center'}}
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="ActiveDeviceList"
        component={ActiveDeviceList}
        options={{title: 'Active Device'}}
        initialParams={{searchFilter}}
      />
      <Tab.Screen
        name="InactiveDeviceList"
        component={InactiveDeviceList}
        options={{title: 'Inactive Device'}}
      />
    </Tab.Navigator>
  );
}
