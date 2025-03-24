import { View, FlatList, RefreshControl } from "react-native";
import React, { useContext } from "react";
import ActiveDeviceItem, { IActiveDeviceControlItem } from "./ActiveDeviceItem";
import { RootTabScreenProps } from "interface/navigation";
import { useAppTheme } from "theme";
import { EmptyDeviceListComponent } from "./DeviceListComponents";
import { useDeviceListQuery } from "hooks/apiHelpers/useDeviceList";
import { IDeviceControlTabItem } from "interface/device";
import LoadingListView from "screens/DeviceControlTabScreen/LoadingListView";
import { SearchContext } from "../../Providers/SearchContext";
import { useFocusEffect } from "@react-navigation/native";
import { SCREEN_HEIGHT } from "../../constants";

const ActiveDeviceList = (props: RootTabScreenProps<"ActiveDevice">) => {
  const { navigation, route } = props;
  const theme = useAppTheme();
  const { searchFilter } = useContext(SearchContext);

  const { data, isLoading, isFetching, refetch } = useDeviceListQuery({
    isActive: 1,
    search: searchFilter,
  });

  const activeDeviceList = data?.data?.data ?? [];

  React.useEffect(() => {
    refetch();
  }, [refetch, searchFilter]);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  const renderDeviceItem = (item: IDeviceControlTabItem, index: number) => {
    return (
      <ActiveDeviceItem
        item={item}
        index={index}
        theme={theme}
        navigation={navigation}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background[900],
      }}
    >
      {isLoading || isFetching ? (
        <LoadingListView />
      ) : (
        <FlatList
          data={activeDeviceList}
          renderItem={({ item, index }) => renderDeviceItem(item, index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          ListEmptyComponent={
            !isLoading && !isFetching && activeDeviceList.length == 0 ? (
              <EmptyDeviceListComponent message="No Active Devices" customStyle={{height: SCREEN_HEIGHT * 0.6}}/>
            ) : (
              <></>
            )
          }
        />
      )}
    </View>
  );
};

export { ActiveDeviceList };
