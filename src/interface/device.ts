import { IDeviceSubItemNames } from 'screens/DeviceControl/DeviceControlSubItems';
import {IGeneralResponse} from './login';
import {IProfile} from './user';

export interface IDeviceControlTabItem {
  DeviceRel: IDeviceRel[];
  RechargeRequest: IRequestRechargeObject[];
  battery_voltage: string;
  charge_status: number;
  createdAt: string;
  fence_status: number;
  id: string;
  is_online: number;
  name: string;
  call_to_action: string;
  location: string;
  pincode: string;
  fence_sensitivity?: string;
  pulse_speed?: string;
  voltage?: string;
  recharge_expiry_date: string;
  sim_number?: any;
  fencing_power: number;
  auto_control?: boolean|number;
  siren: number;
  fencing_power_loading?: boolean;
  auto_control_loading?: boolean;
  siren_loading: boolean;
  sn: string;
  status: number;
  updatedAt: string;
  user_id: string;
}

export interface IRequestRechargeObject {
  createdAt: string;
  created_by?: any;
  device_id: string;
  id: string;
  is_pending: number;
  mobile_number: string;
  status: number;
  updatedAt: string;
  updated_by?: any;
  user_id: string;
}

export interface IDeviceControlTabLIstResponse extends IGeneralResponse {
  data: {data: IDeviceControlTabItem[]};
}

export interface IDeviceControlTabDetailResponse extends IGeneralResponse {
  data: {userDetail: IDeviceControlTabItem};
}

export interface IDeviceRel {
  id: string;
  status: number;
  device_id: string;
  user_id: string;
  is_owner: number;
  createdAt: string;
  updatedAt: string;
  User: IUserDeviceRelItem;
  Device: IDevice;
}

interface IDevice {
  auto_control?: number;
  battery_voltage: number;
  call_to_action: string;
  charge_status: number;
  createdAt: string;
  fence_sensitivity?: any;
  fence_status: number;
  fencing_power: number;
  id: string;
  is_online: number;
  location: string;
  name: string;
  pincode: string;
  pulse_speed?: any;
  recharge_expiry_date: string;
  sim_number?: any;
  siren: number;
  sn: string;
  status: number;
  updatedAt: string;
  user_id: string;
  voltage?: any;
}

export interface IUserDeviceRelItem {
  profile: IProfile;
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
}

export interface IDeviceControlRequest {
  device_id: string;
  fencing_power?: number;
  type?: IDeviceSubItemNames;
  auto_control?: number;
  siren?: number;
  pulse_speed?: string;
  fence_sensitivity?: string;
  voltage?: string;
  onDeviceControlError?: () => void;
  onDeviceControlSuccess?: () => void
}

export interface IAssignDeviceRequest {
  user_id: string;
  devices?: string[];
  remove_devices?: string[];
  onAssignDeviceError: () => void;
  onAssignDeviceSuccess: () => void
}