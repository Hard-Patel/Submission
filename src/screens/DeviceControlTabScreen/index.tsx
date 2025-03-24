import { View, FlatList, RefreshControl } from "react-native";
import React from "react";
import { useAppTheme } from "theme";
import { RootTabScreenProps } from "interface/navigation";
import { useStyleUtils } from "hooks";
import DeviceControlItem from "./DeviceControlItem";
import { useDeviceListQuery } from "hooks/apiHelpers/useDeviceList";
import { IDeviceControlTabItem } from "interface/device";
import { EmptyDeviceListComponent } from "screens/DeviceControlList/DeviceListComponents";
import LoadingListView from "./LoadingListView";
import { useDeviceControl } from "hooks/apiHelpers/useDeviceControl";
import { useFocusEffect } from "@react-navigation/native";
import { IDeviceSubItemNames } from "screens/DeviceControl/DeviceControlSubItems";
import { SCREEN_HEIGHT } from "../../constants";

const DeviceControlTabScreen = (
  props: RootTabScreenProps<"DeviceControlTab">
) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();

  const { data, isLoading, isFetching, isError, refetch } = useDeviceListQuery({
    isActive: 1,
    isForDeviceControlTab: true,
  });

  const deviceControlList = data?.data?.data ?? [];

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerTitle: "Device Control",
      headerLeft: () => <></>,
    });
  }, [theme, navigation, headerTitleStyle]);

  const { tryDeviceControl } = useDeviceControl();

  const handleDeviceControlPress = (item: IDeviceControlTabItem) => {
    tryDeviceControl({
      device_id: item.id,
      fencing_power: item.fencing_power ? 0 : 1,
      type: IDeviceSubItemNames.FENCING_POWER,
    });
  };

  const renderDeviceItem = (item: IDeviceControlTabItem, index: number) => {
    return (
      <DeviceControlItem
        item={item}
        index={index}
        theme={theme}
        isLoading={item?.fencing_power_loading}
        navigation={navigation}
        onTogglePress={handleDeviceControlPress}
        onSettingsPress={(id) =>
          navigation.navigate("DeviceConfigurationSetting", { device_id: id })
        }
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background[900],
        paddingHorizontal: 16,
      }}
    >
      {isLoading ? (
        <LoadingListView />
      ) : (
        <FlatList
          data={deviceControlList}
          renderItem={({ item, index }) => renderDeviceItem(item, index)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          contentContainerStyle={{paddingTop: 12, paddingBottom: 120}}
          ListEmptyComponent={
            deviceControlList.length == 0 && !isLoading && !isFetching ? (
              <EmptyDeviceListComponent message="No Devices Found" customStyle={{height: SCREEN_HEIGHT * 0.75}} />
            ) : (
              <></>
            )
          }
        />
      )}
    </View>
  );
};

export default DeviceControlTabScreen;
