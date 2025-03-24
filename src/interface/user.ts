/**
 * @format
 */

import { ToastOptions } from "react-native-toast-message";
import { IGeneralResponse, Profile } from "./login";
import { IDeviceRel } from "./device";

export interface ISubscription {
  ai_subscription_active: number;
  ai_subscription_end_time: string;
}

export interface IUser {}

export interface IUserState {
  isLoggedIn: boolean;
  loading: boolean;
  errorMessage: string | null;
  user: IUser;
}

export interface IProfileResponse {
  data: IUser;
}

export interface IRefreshResponse {
  data: {
    accessToken: string;
  };
}

export enum I_ROLE_SC {
  OWNER = "owner",
  USER = "user",
}

export interface ToastMessageProps extends ToastOptions {
  message: string;
  description?: string;
  backgroundColor?: string;
  color?: string;
  duration?: number;
  type?: "default" | "none" | "success" | "info" | "warning";
}

export interface IUserListResponse extends IGeneralResponse {
  data: { userList: IAPIUserItem[] };
}

export interface IUserDetailsResponse extends IGeneralResponse {
  data: { userDetail: IAPIUserItem };
}

export enum IModalType {
  DELETE,
  LOGOUT,
  RECHARGE,
  DELETE_USER,
}

export interface IAPIUserItem {
  id: string;
  email?: any;
  password?: any;
  phone_iso: string;
  phone: string;
  status: number;
  created_by: string;
  updated_by?: any;
  createdAt: string;
  updatedAt: string;
  DeviceRel: IDeviceRel[];
  profile: Profile;
}

export interface IProfile {
  address?: string;
  createdAt: string;
  created_by: string;
  first_name: string;
  id: string;
  is_owner: number;
  last_name: string;
  pincode?: string;
  role_sc: I_ROLE_SC;
  updatedAt: string;
  updated_by?: any;
  user_id: string;
}
export interface IAssignUserRequest {
  device_id: string;
  users?: string[];
  remove_users?: string[];
  onAssignUserError: () => void;
  onAssignUserSuccess: () => void;
}

export interface IDeviceRechargeRequest {
  device_id: string;
  user_id: string;
  onRechargeRequestError?: () => void;
  onRechargeRequestSuccess?: () => void;
}

export interface INotificationPreferenceRequest extends INotificationPreferencetypes {
  user_id: string;
  onNotificationPrefRequestError?: () => void;
  onNotificationPrefRequestSuccess?: () => void;
}

export interface INotificationPreferencetypes {
  enz_status_on_alert: number;
  enz_status_off_alert: number;
  enz_status_auto_alert: number;
  battery_discharge_alert: number;
  battery_low_alert: number;
  fence_normal_alert: number;
  fence_fault_alert: number;
}

export interface IDeleteUserRequest {
  role: I_ROLE_SC;
  user_id: string;
  isUserSelfDelete: boolean;
  onDeleteuserRequestError?: () => void;
  onDeleteuserRequestSuccess?: () => void;
}



export interface INotificationResponseData extends IGeneralResponse {
  data: INotificationItem[];
  pagination: Pagination;
}

interface Pagination {
  count: number;
  limit: number;
  offset: number;
}

export interface INotificationItem {
  createdAt: string;
  created_by: string;
  description: string;
  device_id: string;
  id: string;
  status: number;
  title: string;
  updatedAt: string;
  user_id: string;
  Device: IDeviceNotification;
  User: INotificationUser;
}

interface INotificationUser {
  alt_phone?: any;
  alt_phone_iso?: any;
  createdAt: string;
  created_by: string;
  email: string;
  id: string;
  password?: any;
  phone: string;
  phone_iso: string;
  status: number;
  updatedAt: string;
  updated_by: string;
}

interface IDeviceNotification {
  auto_control: number;
  battery_voltage: string;
  call_to_action: string;
  charge_status: number;
  createdAt: string;
  fence_sensitivity: string;
  fence_status: number;
  fencing_power: number;
  id: string;
  is_online: number;
  location: string;
  name: string;
  pincode: string;
  pulse_speed: string;
  recharge_expiry_date: string;
  sim_number?: any;
  siren: number;
  sn: string;
  status: number;
  updatedAt: string;
  user_id: string;
  voltage: string;
}