import { ICustomModalState } from 'interface/login';
import { IModalType } from 'interface/user';
import {Platform} from 'react-native';

export const phoneNumberMask = [
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

interface MODALINFORMATION {
  type: IModalType,
  title: string;
  description: string;
  confirm: string;
  cancel: string;
  isVisible: boolean
}

export const ModalTypesInformation: {
  DELETE: MODALINFORMATION,
  RECHARGE: MODALINFORMATION,
  LOGOUT: MODALINFORMATION,
  DELETE_USER: MODALINFORMATION,
} = {
  DELETE: {
    type: IModalType.DELETE,
    title: 'Delete Account',
    description: 'Are you sure you want to delete account?',
    confirm: 'Delete',
    cancel: 'Cancel',
    isVisible: true
  },
  RECHARGE: {
    type: IModalType.RECHARGE,
    title: 'Request For Rechrage',
    description: 'Are you sure you want to request for recharge?',
    confirm: 'Yes',
    cancel: 'Cancel',
    isVisible: true
  },
  LOGOUT: {
    type: IModalType.LOGOUT,
    title: 'Log Out',
    description: 'Are you sure you want to Logout?',
    confirm: 'Logout',
    cancel: 'Cancel',
    isVisible: true
  },
  DELETE_USER: {
    type: IModalType.DELETE_USER,
    title: 'Delete User',
    description: 'Are you sure you want to delete this user?',
    confirm: 'Delete',
    cancel: 'Cancel',
    isVisible: true
  }
};

export const DEVICE_INFORMATION_FIELDS = {
  NICKNAME: 'NICKNAME',
  LOCATION: 'LOCATION',
  PINCODE: 'PINCODE',
  CALL: 'CALL',
  EXPIRY: 'EXPIRY',
};
export const securePreference = {
  sharedPreferencesName: 'nftnow',
  keychainService: 'nftnow',
};

export const KEYBOARD_EXTRA_HEIGHT = Platform.OS === 'android' ? 200 : 150;
