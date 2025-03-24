import {
  AutoControlIcon,
  BatteryIcon,
  ChargingIcon,
  FenceIcon,
  FencepowerIcon,
  FenceVoltageIcon,
  PrimarySwitchOffIcon,
  PrimarySwitchOnIcon,
  SirenIcon,
} from "assets/svg";
import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IDeviceItem } from "screens/AssignDeviceScreeen/DeviceItem";
import { fontFamily, useAppTheme } from "theme";

export interface IDeviceSubItem {
  type: number;
  status?: boolean;
  isLoading?: boolean;
  name: string;
  item: IDeviceSubItemNames;
  state?: string;
  setStatus?: () => void;
  color?: string;
}

export enum IDeviceSubItemNames {
  FENCING_POWER = "FENCING_POWER",
  SIREN = "SIREN",
  FENCE_STATE = "FENCE_STATE",
  BATTERY_COLTAGE = "BATTERY_COLTAGE",
  FENCE_VOLTAGE = "FENCE_VOLTAGE",
  CHARGING_STATUS = "CHARGING_STATUS",
  AUTO_CONTROL = "AUTO_CONTROL",
  CONFIGURATIONS = "CONFIGURATIONS"
}

const renderIcon = (item: IDeviceSubItemNames) => {
  if (item == IDeviceSubItemNames.BATTERY_COLTAGE) {
    return <BatteryIcon />;
  } else if (item == IDeviceSubItemNames.CHARGING_STATUS) {
    return <ChargingIcon />;
  } else if (item == IDeviceSubItemNames.FENCE_STATE) {
    return <FenceIcon />;
  } else if (item == IDeviceSubItemNames.SIREN) {
    return <SirenIcon />;
  } else if (item == IDeviceSubItemNames.AUTO_CONTROL) {
    return <AutoControlIcon />;
  } else if (item == IDeviceSubItemNames.FENCE_VOLTAGE) {
    return <FenceVoltageIcon />;
  } else {
    return <FencepowerIcon />;
  }
};

const DeviceControlSubItems = ({
  type,
  status,
  isLoading,
  setStatus,
  name,
  item,
  state,
  color,
}: IDeviceSubItem) => {
  const theme = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background[950],
        height: 54,
        borderRadius: 10,
        paddingHorizontal: 14,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {renderIcon(item)}
        <Text
          style={{
            fontSize: 16,
            lineHeight: 27,
            fontFamily: fontFamily.regular,
            color: theme.colors.text[600],
            marginLeft: 12,
          }}
        >
          {name}
        </Text>
      </View>

      {type == 1 ? (
        <Text
          style={{
            fontSize: 14,
            color: color,
            lineHeight: 24,
            fontFamily: fontFamily.medium,
          }}
        >
          {state}
        </Text>
      ) : (
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
              onPress={() => {
                setStatus();
              }}
            >
              {status ? <PrimarySwitchOnIcon /> : <PrimarySwitchOffIcon />}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export { DeviceControlSubItems };
