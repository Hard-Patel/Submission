import {IUserUpdateValues} from 'screens/AddUpdateUserScreen/useUserForm';
import {IDeviceControlTabItem} from './device';
import {IModalType, INotificationPreferencetypes, I_ROLE_SC} from './user';

export interface ILoginReuqest {
  email?: string;
  phoneNumber?: string;
  callback: () => void;
}

export interface IGeneralResponse {
  cancel: boolean;
  errors: any;
  message: string;
  status: boolean;
  statusCode: number;
}

export interface ILogin {
  LoginData: ILoginData;
}

export interface ILoginData {
  id: string;
  email: string;
  phone_iso: string;
  phone: string;
  status: number;
  profile: Profile;
  authentication: Authentication;
}

export interface ILoginDataStoreState {
  isLoggedIn: boolean;
  loading: boolean;
  errorMessage?: string;
  user: ILoginData;
}

export interface IModalInformationData {
  type: IModalType;
  isVisible: boolean;
  title: string;
  description: string;
  cancel: string;
  confirm: string;
  custom_data?: {
    id: string;
    isSelfDelete: boolean;
    role: I_ROLE_SC;
  };
}

export interface ICustomModalState {
  modalInformation: IModalInformationData;
}

interface Authentication {
  token: string;
  refreshToken: string;
}

export interface Profile extends INotificationPreferencetypes {
  id: string;
  first_name: string;
  last_name: string;
  is_owner: number;
  role_sc: I_ROLE_SC;
  user_id: string;
  aadhar_card_number?: any;
  address?: any;
  battery_discharge_alert: number;
  battery_low_alert: number;
  createdAt: string;
  created_by: string;
  enz_status_auto_alert: number;
  enz_status_off_alert: number;
  enz_status_on_alert: number;
  fence_fault_alert: number;
  fence_normal_alert: number;
  pincode?: any;
  updatedAt: string;
  updated_by?: any;
}

export interface IOEMType {
  created_type: string;
  id: string;
  code: string;
}

export interface ILoginRequest {
  onSendOtp: (data: ISendOTPResponseSuccessCallback) => void;
  onSendOTPError: () => void;
  phoneNumber?: string;
  email?: string;
  phoneNumberMasked: string;
  country: string;
  type: ILoginRequestType;
}

export interface IVerifyOTPRequest {
  onVerifyOTP: () => void;
  onVerifyOTPError: () => void;
  user_id: string;
  otp: string;
  device_type: number;
  device_token: string;
}

export interface IEditDeviceRequest {
  onEditDeviceSuccess: () => void;
  onEditDeviceError: () => void;
  device_id: string;
  deviceDetail: IDeviceUpdateRequestData;
}

export interface IEditUserRequest {
  onEditUserSuccess: () => void;
  onEditUserError: () => void;
  user_id: string;
  edit: boolean;
  userDetailsUpdate: IUserUpdateValues;
}

export interface IUserUpdateRequestData {
  name?: string;
  call_to_action?: string;
  location?: string;
  pincode?: string;
  status?: number;
  fence_sensitivity?: string;
  pulse_speed?: string;
  auto_control?: number;
  voltage?: string;
}

export interface IDeviceUpdateRequestData {
  name?: string;
  call_to_action?: string;
  location?: string;
  pincode?: string;
  status?: number;
  fence_sensitivity?: string;
  pulse_speed?: string;
  auto_control?: number;
  voltage?: string;
}

export enum ILoginRequestType {
  EMAIL = 'email',
  MOBILE = 'phone',
}

export interface ISendOTPResponse extends IGeneralResponse {
  data: ISendOTPResponseData;
}

export interface ISendOTPResponseData {
  email: string;
  otp: number;
  phone: string;
  phone_iso: string;
  user_id: string;
}

export interface ISendOTPResponseSuccessCallback {
  email: string;
  type: ILoginRequestType;
  phoneNumber: string;
  user_id: string;
  country: string;
  phoneNumberMasked: string;
  otp: number;
}

export interface IUpdateDeviceTokenRequest {
  user_id: string;
  device_token: string;
  device_type: number;
  refresh_token: string;
}

export interface IVerifyOTPResponse extends IGeneralResponse {
  data: ILoginData;
}

export interface IUpdateDeviceTokenResponse extends IGeneralResponse {
  data: IUpdateDeviceTokenResponseData | IForceUpdateData;
}
export interface IForceUpdateData {
  ios_version_min: string;
  ios_version_current: string;
  ios_message?: string;
  android_version_min: string;
  android_version_current: string;
  android_message?: string;
}
export interface IUpdateDeviceTokenResponseData {
  force_update: {
    ios_version_min: string;
    ios_version_current: string;
    ios_message?: string;
    android_version_min: string;
    android_version_current: string;
    android_message?: string;
  };
}

export interface IUpdateDeviceToken {
  loginStatus: boolean;
  params?: IUpdateDeviceTokenRequest;
  callback: (data: IForceUpdateData) => void;
}

export interface ILogoutRequest {
  device_token: string;
}

export interface ILogoutResponse {
  cancel: boolean;
  data: any[];
  message: string;
  status: boolean;
  hardRefresh?: boolean;
  statusCode: number;
  tag: string;
}
