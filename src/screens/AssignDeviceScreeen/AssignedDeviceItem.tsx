import {View, Text} from 'react-native';
import React from 'react';
import {IDevice} from '../AddUpdateUserScreen/useUserForm';
import {fontFamily, useAppTheme} from 'theme';
import {DeleteIcon} from 'assets/svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { IDeviceRel } from 'interface/device';

interface IAssignedDeviceItem {
  device: IDeviceRel;
  index: number;
  isLastItem: boolean;
  handleUserDelete: (id: string)=>void
}

const AssignedDeviceItem = (props: IAssignedDeviceItem) => {
  const {device, index, isLastItem, handleUserDelete} = props;
  const theme = useAppTheme();
  return (
    <>
      <View
        key={`User Item ${index} ${device.id}`}
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 24,
                fontFamily: fontFamily.regular,
                color: theme.colors.text[900],
              }}>{`${index + 1}.`}</Text>
          </View>
          <View style={{marginLeft: 4}}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 24,
                fontFamily: fontFamily.regular,
                color: theme.colors.text[900],
              }}>{`${device.Device.name}`}</Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 24,
                fontFamily: fontFamily.regular,
                color: theme.colors.text[900],
              }}>{`IMEI no. : ${device.Device.sn}`}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=>handleUserDelete(device.device_id)}>
          <DeleteIcon />
        </TouchableOpacity>
      </View>
        <View
          style={{
            backgroundColor: theme.colors.border[800],
            height: isLastItem ? 0 : 1,
            marginVertical: 12,
          }}></View>
    </>
  );
};

export default AssignedDeviceItem;
