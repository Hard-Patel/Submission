/**
 * @format
 */
import React from "react";
import {
  AppState,
  AppStateStatus,
  PermissionsAndroid,
  Platform,
  TextStyle,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  RootStackParamList,
  RootTabParamList,
} from "../../src/interface/navigation";
import { navigationRef } from "./navigationRef";
import CustomTabBar from "./CustomTabBar";
import { fontFamily, useAppTheme, useAppThemeName } from "../../src/theme";
import { useTranslation } from "react-i18next";
import { BrandLogo, HeaderLeft } from "../../src/components/Header";
import { StatusBar } from "native-base";
import UserManagementTabScreen from "../screens/UserManagement";
import SettingsTab from "../screens/Settings";
import { AddDeviceScreen } from "../screens/AssignDeviceScreeen";
import { EditDeviceInformation } from "../screens/EditDeviceInformation";
import { AddUserScreen } from "../screens/AddUpdateUserScreen";
import { DeviceControl } from "../screens/DeviceControl";
import { EditProfile } from "../screens/EditProfile";
import { Support } from "../screens/Support";
import { LoginScreen } from "../screens/LoginScreen";
import { OTPVerification } from "../screens/OTPVerification";
import { DeviceListTopTabBarScreen } from "./DeviceListTopTabBar";
import DeviceControlTabScreen from "../screens/DeviceControlTabScreen";
import { DeviceConfigurationSetting } from "screens/DeviceConfiguration";
import { AssignUsersListScreen } from "screens/UserManagement/AssignUsersListScreen";
import { NotificationPreference } from "screens/Notification";
import { StorageKeys, isAndroid, storage } from "../constants";
import { FCMManager } from "../notification";
import SplashScreen from "react-native-splash-screen";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { focusManager, onlineManager } from "react-query";
import NetInfo from "@react-native-community/netinfo";
import { NotificationListScreen } from "screens/Notification/NotificationListScreen";
import { I_ROLE_SC } from "interface/user";

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavContainer() {
  const theme = useAppTheme();
  const selectedTheme = useAppThemeName();

  React.useEffect(() => {
    const tm = setTimeout(() => {
      SplashScreen.hide();
      notificationPermission();
      clearTimeout(tm);
    }, 1000);
    return () => clearTimeout(tm);
  }, []);

  const onAppStateChange = (status: AppStateStatus) => {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  };

  React.useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      });
    });

    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  const requestPushNotificationsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        FCMManager.createNotificationListeners();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const notificationPermission = async () => {
    await FCMManager.checkPermission();
    if (isAndroid) {
      requestPushNotificationsPermission();
    }
  };

  const screenOptions: NativeStackNavigationOptions = React.useMemo(() => {
    const headerTitleStyle: Pick<
      TextStyle,
      "fontFamily" | "fontSize" | "fontWeight" | "letterSpacing"
    > & {
      color?: string;
    } = {
      color: theme.colors.gray[900],
      fontFamily: fontFamily.semiBold,
      fontSize: 18,
      letterSpacing: 0.3,
      fontWeight: "500",
    };

    return {
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
        borderBottomColor: "transparent",
        shadowColor: "transparent",
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerLeft: () => <HeaderLeft onPress={navigationRef.current?.goBack} />,
    };
  }, [theme]);

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor={theme.colors.background[900]}
        barStyle={
          selectedTheme == "light"
            ? "dark-content"
            : selectedTheme == "dark"
            ? "light-content"
            : "default"
        }
      />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={
            storage.getBoolean(StorageKeys.IS_LOGGEDIN) ? "Tabs" : "LoginScreen"
            // "NotificationListScreen"
          }
          screenOptions={screenOptions}
        >
          <Stack.Screen component={LoginScreen} name="LoginScreen" />
          <Stack.Screen
            component={BottomTabNavigator}
            name="Tabs"
            options={{ headerShown: false }}
          />
          <Stack.Screen component={OTPVerification} name="OTPVerification" />
          <Stack.Screen component={AddDeviceScreen} name="AddDeviceScreen" />
          <Stack.Screen component={AddUserScreen} name="AddUserScreen" />
          <Stack.Screen
            component={EditDeviceInformation}
            name="EditDeviceInformation"
          />
          <Stack.Screen
            component={AssignUsersListScreen}
            name="AssignUsersListScreen"
          />
          <Stack.Screen component={DeviceControl} name="DeviceControl" />
          <Stack.Screen
            component={DeviceConfigurationSetting}
            name="DeviceConfigurationSetting"
          />
          <Stack.Screen component={EditProfile} name="EditProfile" />
          <Stack.Screen
            component={NotificationPreference}
            name="NotificationPreference"
          />
          <Stack.Screen
            component={NotificationListScreen}
            name="NotificationListScreen"
          />
          <Stack.Screen component={Support} name="Support" />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

function BottomTabNavigator() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const role_sc = user?.user?.profile?.role_sc;

  const screenOptions: BottomTabNavigationOptions = React.useMemo(() => {
    const headerTitleStyle: Pick<
      TextStyle,
      "fontFamily" | "fontSize" | "fontWeight" | "letterSpacing"
    > & {
      color?: string;
    } = {
      color: theme.colors.gray[900],
      fontFamily: fontFamily.semiBold,
      fontSize: 18,
      letterSpacing: 0.3,
      fontWeight: "500",
    };

    const headerLeft = () => <BrandLogo />;

    return {
      headerStyle: {
        backgroundColor: theme.colors.background[900],
        borderBottomColor: "transparent",
        shadowColor: "transparent",
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle,
      headerShadowVisible: false,
      tabBarHideOnKeyboard: true,
      tabBarShowLabel: false,
      headerLeft,
      headerTitleAlign: "center",
    };
  }, [theme]);

  return (
    <BottomTab.Navigator
      initialRouteName="DeviceControlTab"
      screenOptions={screenOptions}
      tabBar={renderTabBar}
    >
      <BottomTab.Screen
        component={DeviceControlTabScreen}
        name="DeviceControlTab"
        options={{ title: "Device Control" }}
      />
      {role_sc == I_ROLE_SC.OWNER ? (
        <BottomTab.Screen
          component={UserManagementTabScreen}
          name="UserList"
          options={{ title: "User Management" }}
        />
      ) : (
        <></>
      )}
      {role_sc == I_ROLE_SC.OWNER ? (
        <BottomTab.Screen
          component={DeviceListTopTabBarScreen}
          name="DeviceList"
          options={{ title: "Device List" }}
        />
      ) : (
        <></>
      )}
      <BottomTab.Screen
        component={SettingsTab}
        name="Settings"
        options={{ title: "Settings" }}
      />
    </BottomTab.Navigator>
  );
}

export default NavContainer;
