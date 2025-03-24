/**
 * @format
 */
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import { navigate } from "navigation/navigationRef";
import { storage, StorageKeys } from "constants";
import { saveSecureData } from "../utils/globals.functions";
import { StatusBar } from "react-native";
import notifee from '@notifee/react-native';
import {queryClient} from '../AppProviders';

class NotificationManager {
  constructor() {}

  loggedIn = storage.getBoolean(StorageKeys.TOKEN);

  updateFCMDeviceTokenToServer = undefined;

  async checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled !== -1) {
      this.getToken();
    } else {
      this.requestUserPermission();
    }
  }

  async getToken() {
    this.fcmToken = await messaging().getToken();
    // console.log('this.fcmToken: ', this.fcmToken);
    if (this.fcmToken) {
      await AsyncStorage.setItem("fcmToken", this.fcmToken);
    }
    saveSecureData("fcmToken", this.fcmToken);
    this.createNotificationListeners();
    messaging().onTokenRefresh(async (token) => {
      await AsyncStorage.setItem("fcmToken", token);
    });
  }
  
  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      this.getToken();
    }
  }
  
  async createNotificationListeners() {
    //App is in foreground and received Notification
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      this.showNotification(remoteMessage);
    });

    messaging().onMessage(async (remoteMessage) => {
      this.showNotification(remoteMessage);
    });

    // When the user presses a notification displayed via FCM, this listener will be called
    // if the app has opened from a background state.
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // this.gotoNotificationScreen(remoteMessage);
    });

    // When a notification from FCM has triggered the application to open from a quit state,
    // this method will RemoteMessage containing the notification data, or null
    // if the app was opened via another method.
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          this.gotoNotificationScreen(remoteMessage);
        }
      });
  }

  async showNotification(message) {
    console.log('message: ', message);
    const isLoggedIn = storage.getBoolean(StorageKeys.TOKEN);
    if (!isLoggedIn) {
      return;
    }
    const { notification } = message;
    const { title, body } = notification;
    showMessage({
      message: title,
      description: body,
      type: "default",
      duration: 3000,
      backgroundColor: "#FF7032",
      color: "white",
      statusBarHeight: StatusBar.currentHeight,
      onPress: () => this.gotoNotificationScreen(message, 0),
    });
    // const cacheKey = [`${QueryKeys.DeviceList}`]
    // queryClient.cancelQueries(cacheKey);
    // queryClient.resetQueries(cacheKey);
    // queryClient.invalidateQueries(cacheKey, {refetchActive: true});
    // queryClient.refetchQueries(cacheKey);
  }

  gotoNotificationScreen(message, delay = 1000) {}

  redirectAppropriate() {
    navigate("Notification");
  }
}
const FCMManager = new NotificationManager();
export { FCMManager };
