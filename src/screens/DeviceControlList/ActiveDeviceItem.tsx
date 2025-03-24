import { View, Text, Switch, Pressable, Linking } from "react-native";
import React, { useState } from "react";
import { AppTheme, fontFamily } from "theme";
import { AlertIcon, CallbuttonIcon, PenIcon, UsersIcon } from "assets/svg";
import { getFenceState, isExpired } from "utils/globals.functions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, RootTabParamList } from "interface/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IDeviceControlTabItem } from "interface/device";
import { HIT_SLOP_INSETS, SCREEN_WIDTH } from "../../constants";

export interface IActiveDeviceControlItem {
  item: IDeviceControlTabItem;
  index: number;
}

export interface IActiveDeviceControlItemProps
  extends IActiveDeviceControlItem {
  theme: AppTheme;
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, "ActiveDevice", undefined>,
    NativeStackNavigationProp<RootStackParamList, undefined>
  >;
}

const ActiveDeviceItem = ({
  item,
  theme,
  index,
  navigation,
}: IActiveDeviceControlItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        navigation.navigate("DeviceControl", { device_id: item?.id });
      }}
      key={`Device Control Item ${index} ${item?.id}`}
      style={{
        minHeight: 120,
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
                width: SCREEN_WIDTH * 0.7,
                lineHeight: 24,
                marginRight: 6,
              }}
              numberOfLines={2}
            >
              {`${item?.name ?? "-"}`}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={HIT_SLOP_INSETS}
            onPress={() => {
              navigation.navigate("EditDeviceInformation", {
                edit: true,
                device_id: item?.id,
              });
            }}
          >
            <PenIcon color={theme.colors.gray[900]} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              color: theme.colors.text[800],
              fontFamily: fontFamily.regular,
              fontSize: 14,
              lineHeight: 21,
              marginTop: 0,
            }}
            numberOfLines={1}
          >
            {`IMEI no. : ${item?.sn ?? "-"}`} 
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 20,
            paddingVertical: 6,
            paddingHorizontal: 14,
            backgroundColor: "#2222221A",
          }}
        >
          <UsersIcon color={theme.colors.gray[900]} />
          <Text
            style={{
              marginLeft: 4,
              fontSize: 12,
              fontFamily: fontFamily.regular,
              color: theme.colors.text[900],
            }}
          >
            {`${item?.DeviceRel?.length ?? 0} Users`}
          </Text>
        </View>
        {isExpired(item?.recharge_expiry_date) && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              paddingVertical: 6,
              paddingHorizontal: 12,
              marginLeft: 6,
              backgroundColor: "#E8303033",
            }}
          >
            <AlertIcon />
            <Text
              style={{
                marginLeft: 4,
                fontSize: 12,
                fontFamily: fontFamily.regular,
                color: theme.colors.state.failure,
              }}
            >
              {`Recharge Expired`}
            </Text>
          </View>
        )}
        <TouchableOpacity
          hitSlop={HIT_SLOP_INSETS}
          onPress={() => {
            Linking.openURL(`tel:${item?.call_to_action ?? ""}`);
          }}
        >
          <CallbuttonIcon />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ActiveDeviceItem;
