import { View, Text, FlatList, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { RootTabScreenProps } from "interface/navigation";
import { fontFamily, useAppTheme } from "theme";
import { useStyleUtils } from "hooks";
import { PrimaryArrowRightIcon } from "assets/svg";
import { showCustomDialog, useModalActions } from "../../redux/modal";
import { ModalTypesInformation } from "utils/globals.variables";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { useUserActions } from "../../redux/user";
import { SUPPORT_CONTACT_NUMBER } from "../../constants";

const SettingsKey = {
  Notification: "notification",
  NotificationList: "NotificationList",
  Profile: "profile",
  Support: "support",
  DeleteAccount: "delete",
  Logout: "logout",
};

const Settingsdata = [
  { id: 6, name: "Notifications", key: SettingsKey.NotificationList },
  {
    id: 1,
    name: "General Notification Preference",
    key: SettingsKey.Notification,
  },
  { id: 2, name: "Edit Profile", key: SettingsKey.Profile },
  { id: 3, name: "Support", key: SettingsKey.Support },
  { id: 4, name: "Delete account", key: SettingsKey.DeleteAccount },
  { id: 5, name: "Log out", key: SettingsKey.Logout },
];

const SettingsTab = (props: RootTabScreenProps<"DeviceList">) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();
  const { showDialog } = useModalActions();
  const { user } = useSelector((state: RootState) => state.user);
  const user_id = user?.profile?.user_id ?? "";
  const role_sc = user?.profile?.role_sc;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerTitle: "Settings",
      headerLeft: () => <></>,
    });
  }, [theme, navigation, headerTitleStyle]);

  const handleUserDeletePress = (user_id: string) => {
    showDialog({
      ...ModalTypesInformation.DELETE_USER,
      description: "Are you sure you want to delete the account?",
      custom_data: {
        id: user_id,
        isSelfDelete: true,
        role: role_sc,
      },
    });
  };

  const handleSettingsItemPress = (key: string) => {
    if (key == SettingsKey.Notification) {
      navigation.navigate("NotificationPreference");
    } else if (key == SettingsKey.NotificationList) {
      navigation.navigate("NotificationListScreen");
    } else if (key == SettingsKey.Logout) {
      showDialog({
        ...ModalTypesInformation.LOGOUT,
      });
    } else if (key == SettingsKey.DeleteAccount) {
      handleUserDeletePress(user_id);
    } else if (key == SettingsKey.Profile) {
      navigation.navigate("EditProfile");
    } else if (key == SettingsKey.Support) {
      Linking.canOpenURL(`whatsapp://send?phone=${SUPPORT_CONTACT_NUMBER}`).then(
        (supported) => {
          if (supported) {
            Linking.openURL(`whatsapp://send?phone=${SUPPORT_CONTACT_NUMBER}`)
          } else {
            Linking.openURL(`https://api.whatsapp.com/send/?phone=${SUPPORT_CONTACT_NUMBER}`)
          }
        }
      );
    }
  };

  const renderSettingItem = ({
    item,
    index,
  }: {
    item: { id: number; name: string; key: string };
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleSettingsItemPress(item.key);
        }}
        style={{
          backgroundColor: theme.colors.background[950],
          borderRadius: 10,
          height: 50,
          paddingHorizontal: 14,
          justifyContent: "space-between",
          marginTop: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            fontFamily: fontFamily.medium,
            color: theme.colors.text[900],
          }}
        >
          {item.name}
        </Text>
        <PrimaryArrowRightIcon />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background[900] }}>
      <FlatList
        data={Settingsdata}
        renderItem={renderSettingItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

export default SettingsTab;
