import {securePreference} from './globals.variables';
import SInfo from 'react-native-sensitive-info';
import moment from 'moment';
import {Alert, Linking} from 'react-native';
import { IModalType } from 'interface/user';
import { StorageKeys } from '../constants';

// Todo
export const getFenceState = (state: number) => {
  switch (state) {
    case 1:
      return 'Normal';
    case 0:
      return 'Faulty';
    default:
      return 'Normal';
  }
};

export const getChargingState = (state: number) => {
  switch (state) {
    case 1:
      return 'ON';
    case 0:
      return 'OFF';
    default:
      return 'OFF';
  }
};

export const saveSecureData = async (name, data) => {
  const x = await SInfo.setItem(name, data, securePreference);

  return x;
};

export const deleteSecureData = async name => {
  const x = await SInfo.deleteItem(name, securePreference);
  return x;
};

export const getSecureData = async name => {
  const y = await SInfo.getItem(name, securePreference);
  return y;
};

export const jsonToURI = json => encodeURIComponent(JSON.stringify(json));

export const timeSince = (date = Date.now()) => {
  if (date) {
    return moment(date).fromNow();
  }
  return 0;
};

export const formattedDate = (date): string => {
  if (date) {
    return moment(date).format('Do MMM YYYY, h:mm A');
  }
  return '-';
};

export const formattedDateWithCustomFormat = (
  date,
  format = 'Do MMM YYYY, h:mm A',
) => {
  if (date && format) {
    return moment(date).format(format);
  }
  return '-';
};

export const getActivityGroupData = data => {
  const outArray = [
    {
      title: 'Today',
      data: [],
    },
    {
      title: 'Yesterday',
      data: [],
    },
    {
      title: 'This Week',
      data: [],
    },
    {
      title: 'This Month',
      data: [],
    },
    {
      title: 'Earlier',
      data: [],
    },
  ];

  if (!data) {
    return outArray;
  }

  if (data.length <= 0) {
    return outArray;
  }

  const today = moment().format('YYYY-MM-DD');
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  const startOfWeek = moment().day(1).format('YYYY-MM-DD'); // Monday
  const endOfWeek = moment().day(7).format('YYYY-MM-DD'); // Sunday
  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  const result = [...outArray];
  data.forEach(item => {
    const date = moment(item.end_date).format('YYYY-MM-DD');
    if (date === today) {
      result[0].data.push(item);
    } else if (date === yesterday) {
      result[1].data.push(item);
    } else if (date >= startOfWeek && date <= endOfWeek) {
      result[2].data.push(item);
    } else if (date >= startOfMonth && date <= endOfMonth) {
      result[3].data.push(item);
    } else if (date < startOfMonth) {
      result[4].data.push(item);
    }
  });

  return result;
};

export const thisWeek = (startDate, endDate) => {
  const currentDate = moment();
  const dateToCheck = moment(endDate);
  const isInCurrentWeek = dateToCheck.isSame(currentDate, 'week');
  return isInCurrentWeek;
};

export const lastWeek = (startDate, endDate) => {
  const currentDate = moment();
  const dateToCheck = moment(endDate);
  const lastWeekStartDate = currentDate
    .clone()
    .subtract(1, 'week')
    .startOf('week');
  const lastWeekEndDate = currentDate.clone().subtract(1, 'week').endOf('week');
  const isInLastWeek = dateToCheck.isBetween(
    lastWeekStartDate,
    lastWeekEndDate,
    undefined,
    '[]',
  );
  return isInLastWeek;
};

export const lastMonth = (startDate, endDate) => {
  const currentDate = moment();
  const dateToCheck = moment(endDate);
  const lastMonthStartDate = currentDate
    .clone()
    .subtract(1, 'month')
    .startOf('month');
  const lastMonthEndDate = currentDate
    .clone()
    .subtract(1, 'month')
    .endOf('month');
  const isInLastMonth = dateToCheck.isBetween(
    lastMonthStartDate,
    lastMonthEndDate,
    undefined,
    '[]',
  );
  return isInLastMonth;
};

export const navigateToMap = ({Lt = 0, Lg = 0}) => {
  if (Lt && Lg) {
    const latitude = Lt; // Replace with the actual latitude of the location
    const longitude = Lg; // Replace with the actual longitude of the location
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    Linking.canOpenURL(url)
      .then(supported => {
        return Linking.openURL(url);
      })
      .catch(err => console.error('An error occurred', err));
  }
};

const openGoogleMaps = () => {};

export function findMinMaxValuesWithIndices(array = []) {
  let minValue = Infinity;
  let minIndex = -1;
  let maxValue = -Infinity;
  let maxIndex = -1;

  for (let i = 0; i < array.length; i++) {
    if (array[i] < minValue) {
      minValue = array[i];
      minIndex = i;
    }

    if (array[i] > maxValue) {
      maxValue = array[i];
      maxIndex = i;
    }
  }

  const min = minValue == Infinity ? 0 : minValue;
  const max = maxValue == -Infinity ? 0 : maxValue;

  return {
    minValue: {value: min, index: minIndex + 1},
    maxValue: {value: max, index: maxIndex + 1},
  };
}

export const secondsToHoursMinutes = seconds => {
  const hours = Math.floor(seconds / 3600); // 1 hour has 3600 seconds
  let remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60); // 1 minute has 60 seconds
  remainingSeconds = seconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSeconds?.toFixed(0),
  };
};

export const formatSecondsToMinutesText = s => {
  const {hours, seconds, minutes} = secondsToHoursMinutes(s);
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const BMStateData = [
  {label: 'Off', value: 0},
  {label: 'Ready', value: 1},
  {label: 'Drive', value: 2},
  {label: 'Charge', value: 3},
  {label: 'Emergency', value: 4},
  {label: 'Fault', value: 5},
  {label: 'SNA', value: 16},
];

export const isHigher = (newVersion: string, currentVersion: string) => {
  let firstVersion = newVersion?.replace(/[.]/g, '');
  let secondVersion = currentVersion?.replace(/[.]/g, '');
  const diffValue = firstVersion?.length - secondVersion?.length;

  const shouldFormat =
    newVersion?.includes('.') || currentVersion?.includes('.');

  if (shouldFormat) {
    if (diffValue > 0) {
      for (let i = 0; i < diffValue; i++) {
        secondVersion += '0';
      }
    } else if (diffValue < 0) {
      for (let i = 0; i < diffValue * -1; i++) {
        firstVersion += '0';
      }
    }
  }
  const higherVersion = Number(firstVersion) > Number(secondVersion);
  return higherVersion;
};

export const isExpired = (timeStampUTC: string) => {
  return moment(timeStampUTC).isBefore() ?? false;
};

export const extractSelectedFromList = (list: string[], prefered: string) => {
  return list.reduce((a, v) => {
    if (v === prefered) {
      a = v;
    }
    return a;
  }, prefered);
};

export const saveTokenAndRefreshTokenInSecureData = async (token, refreshToken) => {
  await saveSecureData(StorageKeys.TOKEN, token)
  await saveSecureData(StorageKeys.REFRESH_TOKEN, refreshToken)
}

export const getErrorMessage = (error?: string) => {
  const somethingWentWrong = "Something went wrong, please try again later"
  if (error == "Cannot read property 'config' of undefined") {
    return somethingWentWrong
  }
  return error ?? somethingWentWrong
}