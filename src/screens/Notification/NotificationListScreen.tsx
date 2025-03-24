import { View, Text, FlatList } from "react-native";
import React from "react";
import { RootStackScreenProps } from "interface/navigation";
import { AppTheme, fontFamily, useAppTheme } from "theme";
import { useStyleUtils } from "hooks";
import { HeaderLeft } from "components/Header";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useNotificationListWithPagination } from "hooks/apiHelpers/useNotificationList";
import { RefreshControl } from "react-native-gesture-handler";
import LoadingListView from "screens/DeviceControlTabScreen/LoadingListView";
import { INotificationItem } from "interface/user";
import { formattedDate } from "utils/globals.functions";
import { EmptyDeviceListComponent } from "screens/DeviceControlList/DeviceListComponents";

const NotificationListScreen = (
  props: RootStackScreenProps<"NotificationListScreen">
) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();

  const user = useSelector((state: RootState) => state.user);
  const user_id = user?.user?.profile?.user_id ?? ""
  const {
    data: notificationList,
    isLoading,
    isFetching,
    refetch,
    onEndReached,
  } = useNotificationListWithPagination({ user_id: user_id });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerTitleAlign: "center",
      headerShadowVisible: false,
      headerTitle: "Notifications",
      headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
    });
  }, [theme, navigation, headerTitleStyle]);

  const renderItem = ({ item, index }) => {
    return <NotificaionItem item={item} index={index} theme={theme} />;
  };

  if (
    (isLoading || isFetching) &&
    !notificationList &&
    notificationList.length
  ) {
    return <LoadingListView />;
  }

  return (
    <FlatList
      data={notificationList}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background[900],
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading || isFetching}
          onRefresh={refetch}
        />
      }
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.15}
      ListEmptyComponent={
        !isLoading && !isFetching && notificationList?.length == 0 ? (
          <EmptyDeviceListComponent message="No notifications found" />
        ) : (
          <></>
        )
      }
    />
  );
};

export const NotificaionItem = ({
  item,
  index,
  theme,
}: {
  item: INotificationItem;
  index: string;
  theme: AppTheme;
}) => {
  return (
    <View
      key={`Notification Item ${index}`}
      style={{
        backgroundColor: theme.colors.background[950],
        marginVertical: 8,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: theme.colors.text[900],
          fontFamily: fontFamily.medium,
        }}
        numberOfLines={2}
      >
        {`${item?.Device?.name ?? ""}: ${item?.title ?? "-"}`}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.colors.text[800],
          fontFamily: fontFamily.medium,
        }}
      >
        {item?.description}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.text[800],
          fontFamily: fontFamily.medium,
          paddingTop: 2,
        }}
      >
        {formattedDate(item?.createdAt).toString()}
      </Text>
    </View>
  );
};

export { NotificationListScreen };
