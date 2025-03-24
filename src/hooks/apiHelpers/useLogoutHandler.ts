import { Alert } from "react-native";
import { logOutAPI } from "../../api/api";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "react-query";
import { CommonActions } from "@react-navigation/native";
import { saveTokenAndRefreshTokenInSecureData } from "utils/globals.functions";
import { useUserActions } from "../../redux/user";
import { storage, StorageKeys } from "../../constants";
import { navigationRef } from "navigation/navigationRef";
import { useUtils } from "hooks/useUtils";
import { useModalActions } from "../../redux/modal";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { useContext } from "react";
import { SocketContext } from "../../Providers/SocketProvider";

const useLogoutHandler = () => {
  const queryClient = useQueryClient();

  const { showToast } = useUtils();

  const { logoutUser } = useUserActions();
  const { toggleGlobalLoader } = useGlobalLoaderActions();
  const {disconnectSocket} = useContext(SocketContext);

  const clearAllData = async () => {
    // Reset the login data
    saveTokenAndRefreshTokenInSecureData("", "");
    logoutUser();
    disconnectSocket();
    queryClient.clear();

    storage.delete(StorageKeys.TOKEN);
    storage.delete(StorageKeys.EMAIL);
    storage.delete(StorageKeys.PHONE);

    toggleGlobalLoader({ visible: false });

    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "LoginScreen",
          },
        ],
      })
    );
  };

  const triggerLogoutUser = async () => {
    toggleGlobalLoader({ visible: true });
    const FCMToken = await AsyncStorage.getItem("fcmToken");
    logOutAPI({ device_token: FCMToken }).then(async (res) => {
      if (res?.status == true) {
        // Clearing all the local data on logout success
        const tm = setTimeout(() => {
          clearAllData();
          clearTimeout(tm);
        }, 1000);
        showToast({ message: "Logged out successfully" });
      } else if (res?.hardRefresh) {
        const tm = setTimeout(() => {
          clearAllData();
          clearTimeout(tm);
        }, 1000);
      } else {
        toggleGlobalLoader({ visible: false });
        showToast({ message: "Something went wrong, please try again later" });
      }
    });
  };

  const onLogout = () => {
    Alert.alert("", `Are you sure want to Logout?`, [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          triggerLogoutUser();
        },
      },
    ]);
  };

  return { onLogout, triggerLogoutUser, clearAllData };
};

export default useLogoutHandler;
