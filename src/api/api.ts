import axios from "axios";
import { get, patch, post, del } from "./helper";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { routes } from "./routes";
import {
  IEditDeviceRequest,
  IEditUserRequest,
  ILoginRequest,
  ILoginRequestType,
  ILogoutRequest,
  ILogoutResponse,
  ISendOTPResponse,
  IUpdateDeviceToken,
  IUpdateDeviceTokenResponse,
  IVerifyOTPRequest,
  IVerifyOTPResponse,
} from "../interface/login";
import { jsonToURI } from "utils/globals.functions";
import {
  IAssignDeviceRequest,
  IDeviceControlRequest,
  IDeviceControlTabDetailResponse,
  IDeviceControlTabItem,
  IDeviceControlTabLIstResponse,
} from "interface/device";
import {
  I_ROLE_SC,
  IAssignUserRequest,
  IDeleteUserRequest,
  IDeviceRechargeRequest,
  INotificationPreferenceRequest,
  INotificationResponseData,
  IUserDetailsResponse,
  IUserListResponse,
} from "interface/user";

export const tryLogin = async (data: ILoginRequest) => {
  const { phoneNumber, email, type } = data;
  const params =
    type == ILoginRequestType.MOBILE
      ? { phone: phoneNumber, phone_iso: `+91` }
      : {
          email: email,
        };
  console.log("params: ", params);
  return post({
    url: `${routes.login}`,
    data: params,
  }).then((res: ISendOTPResponse) => {
    console.log("res: ", res);
    const { message, status } = res;
    if (status) {
      return res;
    } else {
      throw new Error( "Something went wrong");
    }
  });
};

export const verifyOtp = async (data: IVerifyOTPRequest) => {
  const { otp, user_id, device_token, device_type } = data;
  return post({
    url: `${routes.verifyOTP}`,
    data: { otp, user_id, device_token, device_type },
  }).then((res: IVerifyOTPResponse) => {
    const { message, status } = res;
    if (status) {
      return res;
    } else {
      throw new Error(message ?? "Something went wrong");
    }
  });
};

// Update Device Token API after every auto login (if user is already logged in)
// If loginStatus is true, then it will call the updateDeviceToken API
// If loginStatus is false, then it will call the forceAppUpdate API
export const updateDeviceToken = async (props: IUpdateDeviceToken) => {
  const { loginStatus = false, params = {} } = props ?? {};
  const endpoint = loginStatus
    ? routes.updateDeviceToken
    : routes.forceAppUpdate;
  const requestType = loginStatus ? post : get;
  return requestType({
    url: endpoint,
    data: params,
  }).then((res: IUpdateDeviceTokenResponse) => {
    console.log("updateDeviceToken res: ", res);
    if (res.status) {
      return res;
    } else {
      const error = res?.message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const deviceList = async ({
  offset = 1,
  limit = 500,
  count = 0,
  filter = {},
  user_id = "",
  isActive = 1,
  isForDeviceControlTab,
}: {
  isForDeviceControlTab: boolean;
  offset: number;
  limit: number;
  isActive: number;
  count: number;
  user_id: string;
  filter?: { search?: string };
}) => {
  let encodeData = { is_active: isActive, filter, is_device_tab: isForDeviceControlTab, limit };
  console.log("isActive, search: ", isActive, filter);
  //  offset, count, limit,
  // if (filter?.search?.length) {
  //   encodeData["filter"] = filter
  // }
  const encodedData = jsonToURI(encodeData);
  
  return get({
    url: `${routes.deviceList}${user_id}?data=${encodedData}`,
  }).then((res: IDeviceControlTabLIstResponse) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const deviceDetails = async ({
  device_id = "",
}: {
  device_id: string;
}) => {
  return get({
    url: `${routes.deviceDetail}${device_id}`,
  }).then((res: IDeviceControlTabDetailResponse) => {
    const { status, message = "" } = res;
    console.log('res: ', res);
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const userDetails = async ({ user_id = "" }: { user_id: string }) => {
  return get({
    url: `${routes.userDetails}${user_id}`,
  }).then((res: IUserDetailsResponse) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const deviceDetailsUpdate = async ({
  device_id = "",
  deviceDetail,
}: IEditDeviceRequest) => {
  console.log("deviceDetail: ", deviceDetail);
  return patch({
    url: `${routes.updateDevice}${device_id}`,
    data: { ...deviceDetail },
  }).then((res: IDeviceControlTabDetailResponse) => {
    const { status, message = "" } = res;
    console.log("res: ", res);
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const userDetailsUpdate = async ({
  user_id = "",
  userDetailsUpdate,
  edit = false,
}: IEditUserRequest) => {
  const req = edit ? patch : post;
  const url = edit ? `${routes.user}/${user_id}` : `${routes.user}`;
  return req({
    url: url,
    data: { ...userDetailsUpdate },
  }).then((res: IDeviceControlTabDetailResponse) => {
    const { status, message = "" } = res;
    console.log("res: ", res);
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const userList = async ({
  offset = 1,
  limit = 10,
  count = 0,
  filter = {},
  user_id = "",
}: {
  offset: number;
  limit: number;
  count: number;
  user_id: string;
  filter?: { search?: string };
}) => {
  let encodeData = { filter, owner_id: user_id };
  console.log("filter, owner_id: user_id: ", filter, user_id);
  // if (filter?.search?.length) {
  //   encodeData["filter"] = filter
  // }
  const encodedData = jsonToURI(encodeData);

  return get({
    url: `${routes.userList}?data=${encodedData}`,
  }).then((res: IUserListResponse) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const assignUsers = async ({
  device_id,
  users = [],
  remove_users = [],
}: IAssignUserRequest) => {
  const data = {
    assign_users: users,
    remove_users: remove_users,
  };
  return patch({
    url: `${routes.updateDevice}${device_id}`,
    data: data,
  }).then((res) => {
    const { status, message = "" } = res;
    console.log("res: ", res);
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const deviceRechargeRequest = async ({
  device_id,
  user_id,
}: IDeviceRechargeRequest) => {
  return post({
    url: `${routes.rechargeRequest}`,
    data: { user_id, device_id },
  }).then((res) => {
    const { status, message = "" } = res;
    console.log("res: ", res);
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const notificationPreferenceUpdate = async (
  props: INotificationPreferenceRequest
) => {
  const {
    onNotificationPrefRequestSuccess,
    onNotificationPrefRequestError,
    user_id,
    ...rest
  } = props;

  return patch({
    url: `${routes.notificationPreference}/${user_id}`,
    data: rest,
  }).then((res) => {
    const { status, message = "" } = res;
    console.log("res: ", res);
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const deleteUserRequest = async ({
  user_id,
  role = I_ROLE_SC.USER,
}: IDeleteUserRequest) => {
  const endpoint =
    role == I_ROLE_SC.USER ? routes.deleteUser : routes.deleteOwner;
  return del({
    url: `${endpoint}${user_id}`,
    data: { user_id },
  }).then((res) => {
    const { status, message = "" } = res;
    console.log("res: ", res);
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const assignDevice = async ({
  user_id,
  devices = [],
  remove_devices = [],
}: IAssignDeviceRequest) => {
  const data = {
    assign_devices: devices,
    remove_devices: remove_devices,
  };
  return patch({
    url: `${routes.user}/${user_id}`,
    data: data,
  }).then((res) => {
    const { status, message = "" } = res;
    console.log("res: ", res);
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const controlDevice = async ({
  device_id,
  type,
  ...rest
}: IDeviceControlRequest) => {
  return patch({
    url: `${routes.deviceControl}${device_id}`,
    data: rest,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const batteryPackDetails = async (id: any) => {
  return get({
    url: `${routes.batteryPackDetails}${id}`,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const bmsOverallInfo = async (id: any) => {
  return get({
    url: `${routes.bmsOverallInfo}${id}`,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};
export const BMSFaults = async ({
  isBMSUser,
  id,
  offset,
  count,
  limit,
  type,
  filter = {},
}: {
  isBMSUser: boolean;
  id: string;
  offset: number;
  count: number;
  limit: number;
  type: string;
  filter?: object;
}) => {
  const encodedData = jsonToURI({ offset, count, limit, type, filter });
  const route = isBMSUser ? routes.bmsFaultHistory : routes.oemFaultHistory;
  return get({
    url: `${route}${id}?data=${encodedData}`,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const refetchBMSOverallInfo = async (id: any) => {
  return get({
    url: `${routes.bmsOverallInfo}${id}`,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const bmsStatsInfo = async (id: any) => {
  return get({
    url: `${routes.bmsStatsInfo}${id}`,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const vehicleStatistic = async (data: any) => {
  if (data) {
    return get({
      url: `${routes.vehicleStatistics}${data}`,
    }).then((res) => {
      const { status, message = "" } = res;
      if (status) {
        return res;
      } else {
        const error = message || "Something went wrong";
        throw new Error(error);
      }
    });
  } else {
    const error = "Something went wrong";
    throw new Error(error);
  }
};

export const VehicleTripDetails = async (id: string) => {
  return get({
    url: `${routes.vehicleTripDetail}${id}`,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const recentTrip = async (data: any, UID: any) => {
  if (data == null) {
    var encodedData = null;
    return get({
      url: `${routes.recentTrip}${UID}`,
    }).then((res) => {
      const { status, message = "" } = res;
      if (status) {
        return res;
      } else {
        const error = message || "Something went wrong";
        throw new Error(error);
      }
    });
  } else {
    const encodedData = jsonToURI(data);
    return get({
      url: `${routes.recentTrip}${UID}?data=${encodedData}`,
    }).then((res) => {
      const { status, message = "" } = res;
      if (status) {
        return res;
      } else {
        const error = message || "Something went wrong";
        throw new Error(error);
      }
    });
  }
};

export const batteryCycles = async (data: any, UID: any) => {
  let encodedData = jsonToURI(data);
  return get({
    url: `${routes.batteryCycles}${UID}?data=${encodedData}`,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const notification = async (data: any, UID: any) => {
  const encodedData = jsonToURI(data);

  return get({
    url: `${routes.notification}${UID}?data=${encodedData}`,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const notificationHistory = async ({user_id,...data}: any) => {
  const encodedData = jsonToURI(data);

  return get({
    url: `${routes.notificationHistory}/${user_id}?data=${encodedData}`,
  }).then((res: INotificationResponseData) => {
    const { status, message = "" } = res
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const profileAPI = async () => {
  return get({
    url: `${routes.profile}`,
  }).then((res) => {
    const { status, message = "" } = res;
    if (status) {
      return res;
    } else {
      const error = message || "Something went wrong";
      throw new Error(error);
    }
  });
};

export const logOutAPI = async (data: ILogoutRequest) => {
  const { device_token } = data;
  return post({
    url: `${routes.logout}`,
    data: {
      device_token: device_token,
    },
  }).then((res: ILogoutResponse) => {
    console.log("res: ", res);
    if (res?.status) {
      return res;
    } else if (!res?.status && res?.statusCode == 401) {
      return { ...res, hardRefresh: true };
    } else {
      const error = res?.message || "Something went wrong";
      throw new Error(error);
    }
  });
};
