import {View, Text} from 'react-native';
import React from 'react';
import {IUser} from './useDeviceForm';
import {fontFamily, useAppTheme} from 'theme';
import {DeleteIcon} from 'assets/svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IDeviceRel, IUserDeviceRelItem} from 'interface/device';

interface IAssignedUserItem {
  user: IDeviceRel;
  index: number;
  isLastItem: boolean;
  handleDeletePress: (user_id: string) => void
}

const AssignedUserItem = (props: IAssignedUserItem) => {
  const {user, index, isLastItem, handleDeletePress} = props;
  const theme = useAppTheme();
  return (
    <>
      <View
        key={`User Item ${index} ${user?.id}`}
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
              }}>{`${user?.User?.profile?.first_name} ${user?.User?.profile?.last_name}`}</Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 24,
                fontFamily: fontFamily.regular,
                color: theme.colors.text[900],
              }}>{`Mobile number: ${user?.User?.phone}`}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDeletePress(user.user_id)}>
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

export default AssignedUserItem;
