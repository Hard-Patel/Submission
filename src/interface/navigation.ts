/**
 * @format
 */

import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {ILoginRequestType} from './login';
import {IDeviceControlItem} from 'screens/AssignDeviceScreeen/DeviceItem';
import {IDeviceControlTabItem} from './device';
import {IAPIUserItem} from './user';

export type RootTabParamList = {
  DeviceControlTab: undefined;
  UserList: undefined;
  DeviceList: undefined;
  Settings: undefined;
  ActiveDevice: undefined;
  InactiveDevice: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList> | undefined;
  CreateQRCodeWithForm: {qrCodeTypes: number; title: string};
  LoginScreen: undefined;
  OTPVerification: {
    phoneNumber: string;
    maskedPhoneNumber: string;
    country: string;
    otp: number;
    type: ILoginRequestType;
    user_id: string;
    email?: string;
  };
  AddDeviceScreen: {
    user_id: string;
    device_list?: string[];
  };
  AddUserScreen: {edit: boolean; user_id?: string};
  EditDeviceInformation: {edit: boolean; device_id: string};
  DeviceControl: {device_id: string};
  DeviceConfigurationSetting: {device_id: string};
  NotificationPreference: undefined;
  NotificationListScreen: undefined;
  EditProfile: undefined;
  Support: undefined;
  ActiveDeviceList: undefined;
  InactiveDeviceList: undefined;
  AssignUsersListScreen: {device_id: string; user_list?: string[]};
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootStackNavigationProps<Screen extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, Screen>;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
