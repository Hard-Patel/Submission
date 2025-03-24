/**
 * @format
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";

import { ISubscription, I_ROLE_SC } from "interface/user";

import { useAppDispatch } from "../store";
import { ILoginData, ILoginDataStoreState, Profile } from "interface/login";
import { storage, StorageKeys } from "../../constants";
import {
  deleteSecureData,
  saveSecureData,
  saveTokenAndRefreshTokenInSecureData,
} from "utils/globals.functions";

const initialState: ILoginDataStoreState = {
  isLoggedIn: false,
  loading: false,
  errorMessage: null,
  user: {
    authentication: {
      token: "",
      refreshToken: "",
    },
    email: "",
    id: "",
    phone: "",
    phone_iso: "",
    profile: {
      created_by: "",
      createdAt: "",
      first_name: "",
      id: "",
      is_owner: 0,
      last_name: "",
      updated_by: "",
      updatedAt: "",
      user_id: "",
      role_sc: I_ROLE_SC.USER,
      battery_discharge_alert: 0,
      battery_low_alert: 0,
      enz_status_auto_alert: 0,
      enz_status_off_alert: 0,
      enz_status_on_alert: 0,
      fence_fault_alert: 0,
      fence_normal_alert: 0,
    },
    status: 0,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<ILoginData>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    updateUserInfo: (state, action: PayloadAction<Partial<ILoginData>>) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateUserProfileInfo: (state, action: PayloadAction<Partial<Profile>>) => {
      state.user = {
        ...state.user,
        profile: { ...state.user.profile, ...action.payload },
      };
    },
    setAccessToken: (state, action: PayloadAction<string>) => {},
    updateSubscription: (state, action: PayloadAction<ISubscription>) => {},
    logoutUser: (state) => {
      state.isLoggedIn = initialState.isLoggedIn;
      state.loading = initialState.loading;
      state.errorMessage = initialState.errorMessage;
      state.user = initialState.user;
    },
  },
});

export const {
  setAccessToken,
  setUserInfo,
  updateUserInfo,
  updateUserProfileInfo,
  logoutUser,
  updateSubscription,
} = userSlice.actions;

export const useUserActions = () => {
  const dispatch = useAppDispatch();

  return {
    setUserInfo: async (data: ILoginData) => {
      dispatch(setUserInfo(data));
      saveTokenAndRefreshTokenInSecureData(
        data.authentication.token,
        data.authentication.refreshToken
      );
      storage.set(StorageKeys.IS_LOGGEDIN, true);
      storage.set(StorageKeys.TOKEN, data.authentication.token);
      storage.set(StorageKeys.REFRESH_TOKEN, data.authentication.refreshToken);
    },
    updateUserInfo: (data: ILoginData) => {
      dispatch(updateUserInfo(data));
    },
    updateUserProfileInfo: (data: Partial<Profile>) => {
      dispatch(updateUserProfileInfo(data));
    },
    updateSubscription: (data: ISubscription) =>
      dispatch(updateSubscription(data)),
    logoutUser: async () => {
      dispatch(logoutUser());
      await deleteSecureData(StorageKeys.TOKEN);
      await deleteSecureData(StorageKeys.REFRESH_TOKEN);
      storage.set(StorageKeys.IS_LOGGEDIN, false);
    },
  };
};

const persistConfig: PersistConfig<ILoginDataStoreState> = {
  key: "user",
  version: 1,
  storage: AsyncStorage,
};

export default persistReducer(persistConfig, userSlice.reducer);
