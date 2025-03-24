import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {RootStackScreenProps} from 'interface/navigation';
import {fontFamily, useAppTheme} from 'theme';
import {useStyleUtils} from 'hooks';
import {HeaderLeft} from 'components/Header';
import DeviceItem, {IDeviceControlItem, IDeviceItem} from './DeviceItem';
import {useDeviceListQuery} from 'hooks/apiHelpers/useDeviceList';
import {IDeviceControlTabItem, IDeviceRel} from 'interface/device';
import {useAssignDevicesQuery} from 'hooks/apiHelpers/useAssignDevice';
import { useDebounceValue } from 'hooks/useDebounceValue';
import { SearchComponent } from 'screens/UserManagement/TopBarSearchComponent';
import { CloseIcon, SearchtoptabIcon } from 'assets/svg';
import { EmptyDeviceListComponent } from 'screens/DeviceControlList/DeviceListComponents';

const AddDeviceScreen = (props: RootStackScreenProps<'AddDeviceScreen'>) => {
  const {
    navigation,
    route: {
      params: {user_id = "", device_list = []},
    },
  } = props;
  const theme = useAppTheme();
  const {headerTitleStyle} = useStyleUtils();

  const [selectedList, setSelectedList] = useState<string[]>(device_list);
  const [removeList, setRemoveList] = useState<string[]>([]);
  const {tryAssignDevices} = useAssignDevicesQuery();

  const [search, setSearch] = React.useState<boolean>(false);
  const [searchLocal, setSearchLocal] = React.useState<string>('');
  const debouncedSearch = useDebounceValue(searchLocal, 500);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDeviceListQuery({isActive: 1, search: debouncedSearch});

  const DeviceList = data?.data?.data

  React.useEffect(() => {
    refetch()
  }, [refetch, debouncedSearch])

  const handleSuccess = () => {
    console.log('Success');
    navigation.goBack();
  };

  const handleError = () => {
    console.log('Failure');
  };

  const handleUserSubmit = () => {
    tryAssignDevices({
      user_id: user_id,
      devices: selectedList,
      remove_devices: removeList,
      onAssignDeviceSuccess: handleSuccess,
      onAssignDeviceError: handleError,
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerTitle: search ? '' : 'Assign Device',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: search ? 0 : 0}}>
          {!search ? (
            <HeaderLeft onPress={navigation.goBack} />
          ) : (
            <SearchComponent fullWidth value={searchLocal} setValue={setSearchLocal} />
          )}
        </View>
      ),
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{marginRight: 6}}
            onPress={() => {
              setSearchLocal('');
              setSearch(!search);
            }}>
            {search ? <CloseIcon /> : <SearchtoptabIcon />}
          </TouchableOpacity>
        );
      },
    });
  }, [theme, navigation, headerTitleStyle, search]);

  const renderDeviceItem = (item: IDeviceControlTabItem, index: number) => {
    const isSelected = selectedList.includes(item.id);
    const onDeviceSelected = (device: string) => {
      setSelectedList((deviceList: string[]) => {
        const isPresent = deviceList.includes(device);
        if (isPresent) {
          setRemoveList(oldRemoveList => {
            return [...oldRemoveList, device];
          });
          return deviceList.filter(d => d != device);
        }
        return [...deviceList, device];
      });
    };
    return (
      <DeviceItem
        index={index}
        item={item}
        theme={theme}
        isSelected={isSelected}
        onDeviceSelected={onDeviceSelected}
      />
    );
  };

  if (!isLoading && !isFetching && DeviceList.length == 0) {
    return <EmptyDeviceListComponent message="No Devices Found" />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background[900],
        alignItems: 'center',
      }}>
      <FlatList
        data={DeviceList}
        style={{width: '100%'}}
        renderItem={({item, index}) => renderDeviceItem(item, index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          onPress={() => {navigation.goBack()}}
          style={{
            backgroundColor: theme.colors.background[600],
            flex: 1,
            height: 50,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginRight: 4,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: theme.colors.text[900],
              fontFamily: fontFamily.semiBold,
              fontSize: 14,
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleUserSubmit();
          }}
          style={{
            backgroundColor: theme.colors.primary[900],
            height: 50,
            borderRadius: 8,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            marginLeft: 4,
          }}>
          <Text
            style={{
              color: theme.colors.white[900],
              fontFamily: fontFamily.semiBold,
              fontSize: 14,
            }}>
            Assign
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export {AddDeviceScreen};
