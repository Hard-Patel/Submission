import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React from "react";
import { fontFamily, useAppTheme } from "theme";
import { RootStackScreenProps, RootTabScreenProps } from "interface/navigation";
import { useStyleUtils } from "hooks";
import UserItem, { IUserItem } from "./UserItem";
import { AddIcon, CloseIcon, SearchtoptabIcon } from "assets/svg";
import LoadingListView from "screens/DeviceControlTabScreen/LoadingListView";
import { useUserListQuery } from "hooks/apiHelpers/useUserListQuery";
import { I_ROLE_SC, IAPIUserItem } from "interface/user";
import { EmptyDeviceListComponent } from "screens/DeviceControlList/DeviceListComponents";
import { useModalActions } from "../../redux/modal";
import { ModalTypesInformation } from "utils/globals.variables";
import { useFocusEffect } from "@react-navigation/native";
import { SearchComponent } from "./TopBarSearchComponent";
import { useDebounceValue } from "hooks/useDebounceValue";

const UserManagementTabScreen = (props: RootTabScreenProps<"UserList">) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();
  const { showDialog } = useModalActions();

  const [search, setSearch] = React.useState<boolean>(false);
  const [searchLocal, setSearchLocal] = React.useState<string>("");
  const debouncedSearch = useDebounceValue(searchLocal, 500);

  const { data, isLoading, isFetching, isError, refetch } = useUserListQuery({
    search: debouncedSearch.trim(),
  });
  const userList = data?.data?.userList ?? [];

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  React.useEffect(() => {
    refetch();
  }, [refetch, debouncedSearch]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerTitle: search ? "" : "User Management",
      headerLeft: () =>
        !search ? (
          <></>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: search ? 16 : 0,
            }}
          >
            <SearchComponent placeholder="Try search user using name" value={searchLocal} setValue={setSearchLocal} fullWidth/>
          </View>
        ),
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => {
              setSearchLocal("");
              setSearch(!search);
            }}
          >
            {search ? <CloseIcon /> : <SearchtoptabIcon />}
          </TouchableOpacity>
        );
      },
    });
  }, [theme, navigation, headerTitleStyle]);

  const handleUserDeletePress = (user_id: string, role: I_ROLE_SC) => {
    showDialog({
      ...ModalTypesInformation.DELETE_USER,
      custom_data: {
        id: user_id,
        isSelfDelete: false,
        role,
      },
    });
  };

  const renderUserItem = (item: IAPIUserItem, index: number) => {
    return (
      <UserItem
        item={item}
        index={index}
        theme={theme}
        navigation={navigation}
        onDeletePress={handleUserDeletePress}
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
      ) : !isLoading && userList?.length == 0 && !isFetching ? (
        <EmptyDeviceListComponent message="No Users Found" />
      ) : (
        <FlatList
          data={userList}
          renderItem={({ item, index }) => renderUserItem(item, index)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          contentContainerStyle={{ paddingBottom: 180 }}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddUserScreen", { edit: false });
        }}
        style={{
          backgroundColor: theme.colors.primary[900],
          width: "100%",
          marginBottom: 18,
          height: 50,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 80,
          alignSelf: "center",
          flexDirection: "row",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AddIcon />
          <Text
            style={{
              color: theme.colors.white[900],
              fontFamily: fontFamily.semiBold,
              fontSize: 16,
              lineHeight: 24,
              marginLeft: 6,
            }}
          >
            Add New User
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UserManagementTabScreen;
