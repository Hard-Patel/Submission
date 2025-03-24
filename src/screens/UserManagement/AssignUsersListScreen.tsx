import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { RootStackScreenProps } from "interface/navigation";
import { fontFamily, useAppTheme } from "theme";
import { useStyleUtils } from "hooks";
import { HeaderLeft } from "components/Header";
import AssignUserItem, {
  IAssignUserControlItem,
  IAssignUserItem,
} from "./AssignUserItem";
import { AddIcon, CloseIcon, SearchtoptabIcon } from "assets/svg";
import { useUserListQuery } from "hooks/apiHelpers/useUserListQuery";
import { IAPIUserItem } from "interface/user";
import { useAssignUsersQuery } from "hooks/apiHelpers/useAssignUsers";
import { useUtils } from "hooks/useUtils";
import { useDebounceValue } from "hooks/useDebounceValue";
import { SearchComponent } from "./TopBarSearchComponent";
import { EmptyDeviceListComponent } from "screens/DeviceControlList/DeviceListComponents";

const AssignUsersListScreen = (
  props: RootStackScreenProps<"AssignUsersListScreen">
) => {
  const {
    navigation,
    route: {
      params: { device_id, user_list = [] },
    },
  } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();

  const [selectedList, setSelectedList] = useState<string[]>(user_list);
  const [removeUserList, setRemoveUserList] = useState<string[]>([]);

  const [search, setSearch] = React.useState<boolean>(false);
  const [searchLocal, setSearchLocal] = React.useState<string>("");
  const debouncedSearch = useDebounceValue(searchLocal, 500);

  const { data, isLoading, isError, isFetching, refetch } = useUserListQuery({
    search: debouncedSearch.trim(),
  });
  const userList = data?.data?.userList ?? [];
  const { showToast } = useUtils();

  const { tryAssignUsers } = useAssignUsersQuery();

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
      headerTitleAlign: "center",
      headerShadowVisible: false,
      headerTitle: search ? "" : "Assign User",
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: search ? 0 : 0,
          }}
        >
          {!search ? (
            <HeaderLeft onPress={navigation.goBack} />
          ) : (
            <SearchComponent placeholder="Try search user using name" fullWidth value={searchLocal} setValue={setSearchLocal} />
          )}
        </View>
      ),
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ marginRight: 6 }}
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
  }, [theme, navigation, headerTitleStyle, search, setSearch]);

  const handleSuccess = () => {
    console.log("Success");
    showToast({ message: "User assigned successfully" });
    navigation.goBack();
  };

  const handleError = () => {
    console.log("Failure");
  };

  const handleUserSubmit = () => {
    tryAssignUsers({
      device_id: device_id,
      users: selectedList,
      remove_users: removeUserList,
      onAssignUserSuccess: handleSuccess,
      onAssignUserError: handleError,
    });
  };

  const onMaxSelection = () => {
    showToast({ message: "Maximum number of users selected for single device" });
  };

  const renderAssignUserItem = (item: IAPIUserItem, index: number) => {
    const isSelected =
      selectedList.findIndex((device) => device == item.id) != -1;
    const onUserSelected = (device: string) => {
      setSelectedList((deviceList) => {
        const isPresent = deviceList.includes(device);
        if (isPresent) {
          setRemoveUserList((oldRemoveList) => {
            return [...oldRemoveList, device];
          });
          return deviceList.filter((d) => d != device);
        } else if (deviceList?.length >= 4) {
          onMaxSelection();
          return deviceList;
        }
        return [...deviceList, device];
      });
    };

    return (
      <AssignUserItem
        item={item}
        index={index}
        theme={theme}
        isSelected={isSelected}
        onUserSelected={onUserSelected}
      />
    );
  };

  if (!isLoading && !isFetching && userList.length == 0) {
    return <EmptyDeviceListComponent message="No Users Found" />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background[900],
        alignItems: "center",
      }}
    >
      <FlatList
        data={userList}
        style={{ width: "100%" }}
        renderItem={({ item, index }) => renderAssignUserItem(item, index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 150,
          paddingHorizontal: 16,
        }}
      />
      <View
        style={{
          width: "100%",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AddUserScreen", { edit: false });
          }}
          style={{
            backgroundColor: theme.colors.black[900],
            width: "100%",
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
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => {navigation.goBack()}}
            style={{
              backgroundColor: theme.colors.background[600],
              flex: 1,
              height: 50,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginRight: 4,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: theme.colors.text[900],
                fontFamily: fontFamily.semiBold,
                fontSize: 14,
              }}
            >
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
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              flexDirection: "row",
              marginLeft: 4,
            }}
          >
            <Text
              style={{
                color: theme.colors.white[900],
                fontFamily: fontFamily.semiBold,
                fontSize: 14,
              }}
            >
              Assign
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export { AssignUsersListScreen };
