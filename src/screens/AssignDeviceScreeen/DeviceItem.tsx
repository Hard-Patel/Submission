import {View, Text, Switch} from 'react-native';
import React, {useState} from 'react';
import {AppTheme, fontFamily} from 'theme';
import {
  AlertIcon,
  CallbuttonIcon,
  CheckedPrimaryIcon,
  EditIcon,
  OfflineIcon,
  OffswitchIcon,
  OnlineIcon,
  OnswitchIcon,
  PenIcon,
  SettingsIcon,
  UsersIcon,
} from 'assets/svg';
import {getFenceState} from 'utils/globals.functions';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootStackParamList, RootTabParamList} from 'interface/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {IDeviceControlTabItem, IDeviceRel} from 'interface/device';

export interface IDeviceControlItem {
  item: IDeviceControlTabItem;
  index: number;
}

export interface IDeviceControlItemProps extends IDeviceControlItem {
  theme: AppTheme;
  isSelected: boolean;
  onDeviceSelected: (item: string) => void;
}

export interface IDeviceItem {
  id: string;
  nickname: string;
  imei_number: string;
}

const DeviceItem = ({
  item,
  theme,
  index,
  isSelected,
  onDeviceSelected,
}: IDeviceControlItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onDeviceSelected(item.id);
      }}
      key={`Device Item ${index} ${item?.id}`}
      style={{
        width: '100%',
        borderRadius: 10,
        backgroundColor: isSelected
          ? theme.colors.black[900]
          : theme.colors.background[950],
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        justifyContent: 'space-between',
      }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: isSelected
                  ? theme.colors.white[900]
                  : theme.colors.text[900],
                fontFamily: fontFamily.medium,
                fontSize: 16,
                lineHeight: 24,
                marginRight: 6,
              }}>
              {item.name}
            </Text>
            {isSelected ? <CheckedPrimaryIcon /> : <></>}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <Text
            style={{
              color: isSelected
                ? theme.colors.white[900]
                : theme.colors.text[800],
              fontFamily: fontFamily.regular,
              fontSize: 14,
              lineHeight: 21,
            }}>
            {`IMEI no. : ${item.sn}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DeviceItem;
