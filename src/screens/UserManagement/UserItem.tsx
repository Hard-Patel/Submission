import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AppTheme, fontFamily } from "theme";
import { CallIcon, DeleteIcon, DeviceIcon } from "assets/svg";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, RootTabParamList } from "interface/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { I_ROLE_SC, IAPIUserItem } from "interface/user";
import { HIT_SLOP_INSETS } from "../../constants";

export interface IUserItem {
  item: IAPIUserItem;
  index: number;
}

export interface IUserItemProps extends IUserItem {
  theme: AppTheme;
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, "UserList", undefined>,
    NativeStackNavigationProp<RootStackParamList, undefined>
  >;
  onDeletePress: (id: string, role: I_ROLE_SC) => void;
}

const UserItem = ({
  item,
  theme,
  index,
  navigation,
  onDeletePress,
}: IUserItemProps) => {
  return (
    <TouchableOpacity
      key={`Device Control Item ${index} ${item?.id}`}
      onPress={() => {
        navigation.navigate("AddUserScreen", { edit: true, user_id: item?.id });
      }}
      style={{
        minHeight: 79,
        width: "100%",
        borderRadius: 10,
        backgroundColor: theme.colors.background[950],
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        justifyContent: "space-between",
      }}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: theme.colors.text[900],
                fontFamily: fontFamily.medium,
                fontSize: 16,
                lineHeight: 24,
                marginRight: 6,
              }}
            >
              {`${index + 1}. ${item?.profile?.first_name ?? ""} ${
                item?.profile?.last_name ?? ""
              }`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              onDeletePress(item?.profile?.user_id ?? "", item?.profile?.role_sc ?? I_ROLE_SC.USER)
            }
            hitSlop={HIT_SLOP_INSETS}
          >
            <DeleteIcon />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CallIcon color={theme.colors.gray[800]} />
          <Text
            style={{
              marginLeft: 4,
              fontSize: 14,
              lineHeight: 21,
              fontFamily: fontFamily.regular,
              color: theme.colors.text[900],
            }}
          >{`${item?.phone ?? "-"}`}</Text>
          <View style={{ marginLeft: 18 }} />
          <DeviceIcon color={theme.colors.gray[800]} />
          <Text
            style={{
              marginLeft: 4,
              fontSize: 14,
              lineHeight: 21,
              fontFamily: fontFamily.regular,
              color: theme.colors.text[900],
            }}
          >{`${item?.DeviceRel?.length ?? 0} Devices`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;
