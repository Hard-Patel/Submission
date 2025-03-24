import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useContext } from "react";
import InactiveDeviceItem, { IInactiveDeviceItem } from "./InactiveDeviceItem";
import { useStyleUtils } from "hooks";
import { useAppTheme } from "theme";
import { RootTabScreenProps } from "interface/navigation";
import { useDeviceListQuery } from "hooks/apiHelpers/useDeviceList";
import { IDeviceControlTabItem } from "interface/device";
import { useFocusEffect } from "@react-navigation/native";
import { EmptyDeviceListComponent } from "./DeviceListComponents";
import LoadingListView from "screens/DeviceControlTabScreen/LoadingListView";
import { SearchContext } from "../../Providers/SearchContext";
import { SCREEN_HEIGHT } from "../../constants";

const InactiveDeviceList = (props: RootTabScreenProps<"InactiveDevice">) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();
  const { searchFilter } = useContext(SearchContext);

  const { data, isLoading, isFetching, refetch } = useDeviceListQuery({
    isActive: 2,
    search: searchFilter,
  });

  const inactivateDeviceControlList = data?.data?.data ?? [];

  React.useEffect(() => {
    refetch();
  }, [searchFilter]);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  const renderDeviceItem = (item: IDeviceControlTabItem, index: number) => {
    return (
      <InactiveDeviceItem
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
          data={inactivateDeviceControlList}
          renderItem={({ item, index }) => renderDeviceItem(item, index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          ListEmptyComponent={
            !isLoading &&
            !isFetching &&
            inactivateDeviceControlList.length == 0 ? (
              <EmptyDeviceListComponent message="No Inactive Devices" customStyle={{height: SCREEN_HEIGHT * 0.6}} />
            ) : (
              <></>
            )
          }
        />
      )}
    </View>
  );
};

export { InactiveDeviceList };
