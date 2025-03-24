import React from "react";
import { View, Text } from "react-native";
import { AppTheme, fontFamily } from "theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "interface/navigation";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { IDeviceControlTabItem } from "interface/device";
import { HIT_SLOP_INSETS, SCREEN_WIDTH } from "../../constants";

export interface IInactiveDeviceItem {
  item: IDeviceControlTabItem;
  index: number;
}

export interface IInactiveDeviceItemProps extends IInactiveDeviceItem {
  theme: AppTheme;
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, "InactiveDevice", undefined>,
    NativeStackNavigationProp<RootStackParamList, undefined>
  >;
}

const InactiveDeviceItem = ({
  item,
  theme,
  index,
  navigation,
}: IInactiveDeviceItemProps) => {
  return (
    <View
      key={`Device Control Item ${index} ${item?.id}`}
      style={{
        minHeight: 71,
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
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme.colors.text[900],
                fontFamily: fontFamily.medium,
                fontSize: 16,
                lineHeight: 24,
                marginRight: 6,
                width: SCREEN_WIDTH * 0.6,
              }}
              numberOfLines={2}
            >
              {`${item?.name ?? ""}`}
            </Text>
            <TouchableOpacity
              hitSlop={HIT_SLOP_INSETS}
              onPress={() => {
                navigation.navigate("EditDeviceInformation", {
                  edit: false,
                  device_id: item.id,
                });
              }}
              style={{
                backgroundColor: theme.colors.primary[600],
                height: 33,
                borderRadius: 8,
                paddingHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: theme.colors.white[900],
                  fontFamily: fontFamily.regular,
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
                Activate
              </Text>
            </TouchableOpacity>
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
          <Text
            style={{
              color: theme.colors.text[800],
              fontFamily: fontFamily.regular,
              fontSize: 14,
              lineHeight: 21,
            }}
            numberOfLines={2}
          >
            {`IMEI no. : ${item?.sn ?? ""}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default InactiveDeviceItem;
