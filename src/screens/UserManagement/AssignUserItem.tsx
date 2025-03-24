import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {AppTheme, fontFamily} from 'theme';
import {CallIcon, CheckedPrimaryIcon, DeviceIcon} from 'assets/svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { IAPIUserItem } from 'interface/user';

export interface IAssignUserControlItem {
  item: IAPIUserItem;
  index: number;
}

export interface IAssignUserControlItemProps extends IAssignUserControlItem {
  theme: AppTheme;
  isSelected: boolean;
  onUserSelected: (item: string) => void;
}

export interface IAssignUserItem {
  id: string;
  name: string;
  phoneNumber: string;
  devices: string;
}

const AssignUserItem = ({
  item,
  theme,
  index,
  isSelected,
  onUserSelected,
}: IAssignUserControlItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onUserSelected(item?.id);
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
              {`${index + 1}. ${item?.profile?.first_name ?? "User"} ${item?.profile?.last_name ?? ""}`}
            </Text>
            {isSelected ? <CheckedPrimaryIcon /> : <></>}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CallIcon
              color={
                isSelected ? theme.colors.white[900] : theme.colors.gray[800]
              }
            />
            <Text
              style={{
                marginLeft: 4,
                fontSize: 14,
                lineHeight: 21,
                fontFamily: fontFamily.regular,
                color: isSelected
                  ? theme.colors.white[900]
                  : theme.colors.text[900],
              }}>{`${item?.phone}`}</Text>
            <View style={{marginLeft: 18}} />
            <DeviceIcon
              color={
                isSelected ? theme.colors.white[900] : theme.colors.gray[800]
              }
            />
            <Text
              style={{
                marginLeft: 4,
                fontSize: 14,
                lineHeight: 21,
                fontFamily: fontFamily.regular,
                color: isSelected
                  ? theme.colors.white[900]
                  : theme.colors.text[900],
              }}>{`${item?.DeviceRel?.length ?? 0} Devices`}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AssignUserItem;
