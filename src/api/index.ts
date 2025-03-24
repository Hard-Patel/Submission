/**
 * @format
 */
import { create } from "apisauce";
import { AxiosError } from "axios";
import {
  API_REQUEST_TIMEOUT,
  DEV_API_REQUEST_TIMEOUT,
  StorageKeys,
  storage,
} from "../constants/index";
import {
  getSecureData,
  saveSecureData,
  saveTokenAndRefreshTokenInSecureData,
} from "../utils/globals.functions";
import { navigate, navigationRef } from "navigation/navigationRef";
import Config from "react-native-config";
import { routes } from "./routes";
import { post } from "./helper";
import { store } from "../redux/store";
import { logoutUser } from "../redux/user";
import { CommonActions } from "@react-navigation/native";

const refreshingToken = { initiated: false };

const client = create({
  baseURL: Config.BASE_URL ?? "",
  headers: {
    "Content-Type": "application/json",
    timeout: __DEV__ ? DEV_API_REQUEST_TIMEOUT : API_REQUEST_TIMEOUT,
  },
});

client.axiosInstance.interceptors.request.use(
  async (request) => {
    if (request.headers) {
      const accessToken = await getSecureData(StorageKeys.TOKEN);
      // console.log("Request, accessToken: ", request.url, accessToken);
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    // if (request.url?.includes(routes.bmsList)) {
    //   console.log("request: ", request);
    // }
    return request;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

client.axiosInstance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  async (error: AxiosError) => {
    console.log("error?.request: ", error?.request);
    console.log("error.response?.data: ", error?.response?.data);
    if (error?.response?.data?.status?.code == 401) {
      console.log("Error: ", JSON.stringify(error, null, 2));
      const isRefreshTokenRequest = error.config?.url?.includes(
        routes.refreshToken
      );

      saveTokenAndRefreshTokenInSecureData("", "");
      store.dispatch(logoutUser());

      storage.delete(StorageKeys.TOKEN);
      storage.delete(StorageKeys.EMAIL);
      storage.delete(StorageKeys.PHONE);

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
      // if (!refreshingToken.initiated && !isRefreshTokenRequest) {
      //   refreshingToken.initiated = true;
      //   const refreshAccessToken = await getSecureData('refreshtoken');
      //   if (!refreshAccessToken) {
      //     return Promise.reject(error.response);
      //   }
      //   post({
      //     url: `${routes.refreshToken}`,
      //     data: {
      //       token: refreshAccessToken,
      //     },
      //   }).then(res => {
      //     console.log('res: ', res);
      //     if (res?.status) {
      //       saveTokenAndRefreshTokenInSecureData(
      //         res?.data?.token,
      //         res?.data?.refreshToken,
      //       );
      //       storage.set(StorageKeys.TOKEN, res?.data?.token);
      //       refreshingToken.initiated = false;
      //       return Promise.reject(error.response);
      //     } else {
      //       storage.delete(StorageKeys.TOKEN);
      //       storage.delete(StorageKeys.EMAIL);
      //       storage.delete(StorageKeys.PHONE);
      //       refreshingToken.initiated = false;
      //       navigate('Login');
      //       return;
      //     }
      //   });
      // }
      return Promise.reject(error.response);
    }
    return Promise.reject(error.response);
  }
);

export default client;
