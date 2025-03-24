import { View, Text, Switch, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { AppTheme, fontFamily } from "theme";
import {
  AlertIcon,
  OfflineIcon,
  OffswitchIcon,
  OnlineIcon,
  OnswitchIcon,
  SettingsIcon,
} from "assets/svg";
import { getFenceState, isExpired } from "utils/globals.functions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, RootTabParamList } from "interface/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IDeviceControlTabItem } from "interface/device";
import { HIT_SLOP_INSETS, SCREEN_WIDTH } from "../../constants";
import moment from "moment";
import { useUtils } from "hooks/useUtils";
import { useQueryClient } from "react-query";
import { QueryKeys } from "../../api/QueryKeys";

export interface IDeviceControlItem {
  item: IDeviceControlTabItem;
  index: number;
}

export interface IDeviceControlItemProps extends IDeviceControlItem {
  theme: AppTheme;
  isLoading?: boolean;
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, "DeviceControlTab", undefined>,
    NativeStackNavigationProp<RootStackParamList, undefined>
  >;
  onSettingsPress: (id: string) => void;
  onTogglePress: (item: IDeviceControlTabItem) => void;
}

const DeviceControlItem = ({
  item,
  isLoading,
  theme,
  index,
  onTogglePress,
  navigation,
  onSettingsPress,
}: IDeviceControlItemProps) => {

  const { showToast } = useUtils();
  const queryClient = useQueryClient();

  const handleSwitchPress = () => {
    if (
      Boolean(item?.auto_control)
    ) {
      showToast({ message: "Device is currently in auto control mode" });
      return;
    }
    onTogglePress(item);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        queryClient.resetQueries([`${QueryKeys.DeviceDetails} ${item?.id}`])
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
          <View
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text
              style={{
                color: theme.colors.text[900],
                fontFamily: fontFamily.medium,
                fontSize: 16,
                width: SCREEN_WIDTH * 0.65,
                lineHeight: 24,
                marginRight: 12,
              }}
              numberOfLines={2}
            >
              {`${item?.name}`}
            </Text>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: -2,
              }}
            >
              {isExpired(item?.recharge_expiry_date) && <AlertIcon />}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              onSettingsPress(item?.id);
            }}
            hitSlop={HIT_SLOP_INSETS}
          >
            <SettingsIcon color={theme.colors.gray[900]} />
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
              fontSize: 16,
              lineHeight: 24,
              marginTop: 2,
            }}
            numberOfLines={2}
          >
            {`IMEI no. : ${item?.sn}`}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginTop: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {item?.is_online ? <OnlineIcon /> : <OfflineIcon />}
          <Text
            style={{
              marginLeft: 4,
              fontSize: 14,
              lineHeight: 21,
              fontFamily: fontFamily.regular,
              color: theme.colors.text[900],
            }}
          >{`${item?.is_online ? "Online" : "Offline"}`}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 20,
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              marginLeft: 4,
              fontSize: 12,
              lineHeight: 21,
              fontFamily: fontFamily.regular,
              color: theme.colors.text[900],
            }}
          >
            {`Fence State: `}
            <Text style={{ color: theme.colors.primary[900] }}>
              {getFenceState(item?.fence_status)}
            </Text>
          </Text>
        </View>
        <View
          style={{
            width: 60,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          pointerEvents="box-none"
        >
          {isLoading ? (
            <ActivityIndicator
              size={"small"}
              color={theme.colors.primary[900]}
            />
          ) : (
            <TouchableOpacity
              onPress={handleSwitchPress}
              style={{
                marginTop: 2,
                width: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
              hitSlop={HIT_SLOP_INSETS}
              disabled={isLoading}
            >
              {Boolean(item?.fencing_power) ? (
                <OnswitchIcon />
              ) : (
                <OffswitchIcon />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DeviceControlItem;
