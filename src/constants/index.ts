/**
 * @format
 */
import {
  // eslint-disable-next-line react-native/split-platform-components
  PermissionsAndroid,
  Dimensions,
  Keyboard,
  Platform,
  StyleProp,
  ViewStyle,
  Linking,
  TextStyle,
} from 'react-native';
import {showMessage, FlashMessageProps} from 'react-native-flash-message';
import moment, {Moment} from 'moment';
import {MMKV} from 'react-native-mmkv';

export const HIT_SLOP_INSETS = { bottom: 4, top: 4, left: 4, right: 4 }
export const SUPPORT_CONTACT_NUMBER = "918460225577"

export const SOCKET_UPDATE_TIMEOUT = 5000;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const KEYBOARD_EXTRA_HEIGHT = 200;
export const MAX_CHARACTERS_ALLOWED = 2000;

export const DEV_API_REQUEST_TIMEOUT = 10000;
export const API_REQUEST_TIMEOUT = 60000;

export const isAndroid = Platform.OS === 'android';

export const DEFAULT_LANGUAGE = 'English';

export const APP_STORE_REWVIEW_REDIRECT_URL = '';

export enum StorageKeys {
  LANGUAGE = 'language',
  FAVORITES = 'favorites',
  THEME = 'theme',
  BEEP = 'beep',
  DEFAULT_CAMERA = 'default_camera',
  MULTIPLE_QR_SCAN = 'mutiple_qr_scan',
  MULTIPLE_BARCODE_SCAN = 'mutiple_barcode_scan',
  TOKEN = 'TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  IS_LOGGEDIN = 'IS_LOGGEDIN',
}

export const EMAIL_REGEX =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const storage = new MMKV();

export const DATE_FORMAT = 'Do MMMM YYYY';

export const noop = () => {};

export const closeKeyboard = () => Keyboard.dismiss();

export type ViewStyleProps = StyleProp<ViewStyle>;
export type TextStyleProps = StyleProp<TextStyle>;

export async function canSaveToAndroid() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

interface Device {
  w: number;
  h: number;
}

const DEVICES: Array<Device> = [
  {w: 430, h: 932}, // Apple iPhone 14 Pro Max
  {w: 393, h: 852}, // Apple iPhone 14 Pro
  {w: 428, h: 926}, // Apple iPhone 12 Pro Max, 14 Plus
  {w: 390, h: 844}, // Apple iPhone 12, 12 Pro
  {w: 375, h: 812}, // Apple iPhone 12 mini
  {w: 414, h: 896}, // Apple iPhone 11 Pro Max, XS Max, Apple iPhone 11, XR
  {w: 375, h: 812}, // Apple iPhone X, XS, 11 Pro
];

export const isIPhoneX = (() => {
  if (Platform.OS === 'web' || Platform.OS !== 'ios') {
    return false;
  }
  return (
    DEVICES.filter(d => d.h === SCREEN_HEIGHT && d.w === SCREEN_WIDTH).length >
    0
  );
})();

export const getValidUrlWithProtocol = (url: string) => {
  return url.includes('http://') || url.includes('https://')
    ? url
    : `https://${url}`;
};

export function toggleItemInArray<T>(value: T, array: T[]): T[] {
  const index = array.indexOf(value);

  if (index === -1) {
    // The value doesn't exist in the array, so add it
    return [...array, value];
  }
  // The value exists in the array, so remove it
  return array.filter(item => item !== value);
}

const availableSocialMediaActivities = [
  'com.apple.UIKit.activity.PostToFacebook',
  'com.apple.UIKit.activity.PostToInstagram',
  'com.apple.UIKit.activity.PostToTwitter',
  'com.apple.UIKit.activity.PostToSnapchat',
  'com.apple.UIKit.activity.PostToLinkedIn',
  'org.telegram.messenger.Share',
  'pinterest.shareextension.PinIt',
  'com.google.android.youtube.ShareTube',
  'com.reddit.Reddit.ShareExtension',
  'com.zhiliaoapp.musically.Share',
  'net.whatsapp.WhatsApp.ShareExtension',
  'com.tencent.xin.sharetimeline',
  'com.tumblr.tumblr.Share-With-Tumblr',
  'com.yahoo.flickruploadr.Uploadr',
  'com.vimeo.upload.ShareExtension',
  'com.vk.vkshare.ShareExtension',
  'com.apple.UIKit.activity.PostToWeibo',
  'jp.naver.line.Share',
  'com.medium.medium.share-extension',
  'com.quora.Quora.Share',
  'com.apple.UIKit.activity.Message',
  'com.apple.UIKit.activity.Mail',
];

export const isSupportedSharing = (sharing: string) => {
  return availableSocialMediaActivities.includes(sharing);
};

export const redirectToEmail = () => {
  const email = ''; // Specify the email address
  const subject = 'QR Scanner Generator - Support Request'; // Specify the email subject
  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  Linking.openURL(url)
    .then(() => console.log('Opened email application successfully'))
    .catch(error => console.log('Failed to open email application:', error));
};

export const getIsSpeakerSupportedLanguage = (language: string) => {
  return bcp47Languages.reduce((acc, v) => {
    if (language.includes(v.code)) {
      acc = true;
    }
    return acc;
  }, false);
};

export const PLAYING_TEXT_TYPE = {
  KEYWORDS: 1,
  RESULT: 2,
};

export const isValidCode = (code: string) => {
  const result = code.length === 5 && /[a-z]{2}-[A-Z]{2}/.test(code);
  return result;
};

export const bcp47Languages = [
  {language: 'English', code: 'en-US'},
  {language: 'Spanish', code: 'es'},
  {language: 'French', code: 'fr'},
  {language: 'German', code: 'de'},
  {language: 'Italian', code: 'it'},
  {language: 'Portuguese', code: 'pt'},
  {language: 'Russian', code: 'ru'},
  {language: 'Japanese', code: 'ja'},
  {language: 'Chinese', code: 'zh'},
  {language: 'Korean', code: 'ko'},
  {language: 'Arabic', code: 'ar'},
  {language: 'Hindi', code: 'hi'},
  {language: 'Bengali', code: 'bn'},
  {language: 'Indonesian', code: 'id'},
  {language: 'Turkish', code: 'tr'},
  {language: 'Thai', code: 'th'},
  {language: 'Dutch', code: 'nl'},
  {language: 'Swedish', code: 'sv'},
  {language: 'Norwegian', code: 'no'},
  {language: 'Danish', code: 'da'},
  {language: 'Finnish', code: 'fi'},
  {language: 'Greek', code: 'el'},
  {language: 'Hebrew', code: 'he'},
  {language: 'Polish', code: 'pl'},
  {language: 'Czech', code: 'cs'},
  {language: 'Hungarian', code: 'hu'},
  {language: 'Romanian', code: 'ro'},
  {language: 'Slovak', code: 'sk'},
  {language: 'Slovenian', code: 'sl'},
  {language: 'Croatian', code: 'hr'},
  {language: 'Ukrainian', code: 'uk'},
  {language: 'Vietnamese', code: 'vi'},
  {language: 'Persian', code: 'fa'},
  {language: 'Malay', code: 'ms'},
  {language: 'Tagalog', code: 'tl'},
  {language: 'Afrikaans', code: 'af'},
  {language: 'Swahili', code: 'sw'},
  {language: 'Zulu', code: 'zu'},
  {language: 'Xhosa', code: 'xh'},
  {language: 'Tswana', code: 'tn'},
  {language: 'Sotho', code: 'st'},
  {language: 'Ndebele', code: 'nd'},
  {language: 'Venda', code: 've'},
  {language: 'Tamil', code: 'ta'},
  {language: 'Telugu', code: 'te'},
  {language: 'Marathi', code: 'mr'},
  {language: 'Gujarati', code: 'gu'},
  {language: 'Kannada', code: 'kn'},
  {language: 'Malayalam', code: 'ml'},
  {language: 'Punjabi', code: 'pa'},
  {language: 'Oriya', code: 'or'},
  {language: 'Assamese', code: 'as'},
];

export const keyExtractor = (_: any, index: number) =>
  `${_ + '-' + index}`.toString();

type ToastOptions = FlashMessageProps & {
  message: string;
  title: string;
  onPress?: () => void;
};

export function showSnackbar(props: ToastOptions) {
  const {
    type = 'success',
    title = 'QR',
    message = 'No message',
    onPress = () => {},
    ...rest
  } = props;
  showMessage({
    message: title,
    description: message,
    type: 'default',
    duration: 3000,
    backgroundColor: '#16A07F',
    color: 'white',
    onPress: onPress,
    floating: true,
    ...rest,
  });
}

export const DATE_INPUT_FORMAT = 'DD-MMM-YYYY hh:mm A';

export function roundNext15Min(date: Moment) {
  let intervals = Math.floor(date.minutes() / 15);
  // eslint-disable-next-line no-plusplus
  if (date.minutes() % 15 !== 0) intervals++;
  if (intervals === 4) {
    date.add('hours', 1);
    intervals = 0;
  }
  date.minutes(intervals * 15);
  date.seconds(0);
  return date;
}

const upcAPattern: RegExp = /^\d{12}$/;
const upcEPattern: RegExp = /^\d{6}$/;

export function validateUPCA(upc: string): boolean {
  return upcAPattern.test(upc);
  //  || upcEPattern.test(upc);
}

export function validateUPCE(upc: string): boolean {
  return upcEPattern.test(upc);
  //  || upcEPattern.test(upc);
}

export const checkChatPermissions = async () => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
  return false;
};
