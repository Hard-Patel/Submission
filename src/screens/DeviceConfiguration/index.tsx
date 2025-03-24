import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { RootStackScreenProps } from "interface/navigation";
import { fontFamily, useAppTheme } from "theme";
import { useStyleUtils } from "hooks";
import { BackArrowIcon } from "assets/svg";
import { SCREEN_WIDTH } from "../../constants";
import { extractSelectedFromList } from "utils/globals.functions";
import { useDeviceDetailsQuery } from "hooks/apiHelpers/useDeviceDetails";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { useDeviceControl } from "hooks/apiHelpers/useDeviceControl";
import { IDeviceSubItemNames } from "screens/DeviceControl/DeviceControlSubItems";

const voltageList = ["2", "4", "6", "8", "10"];

const fenseSensitivityList = ["1", "2", "3", "4", "5"];

const pulseSensitivityList = ["1", "2", "3", "4", "5"];

const DeviceConfigurationSetting = (
  props: RootStackScreenProps<"DeviceConfigurationSetting">
) => {
  const {
    navigation,
    route: {
      params: { device_id = "" },
    },
  } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();

  const { isLoading, data, isFetching } = useDeviceDetailsQuery({
    device_id: device_id,
  });
  const device_item = data?.data?.userDetail;

  const [voltage, setVoltage] = useState<string>("");

  const [fenseSensitivity, setFenseSensitivity] = useState<string>();
  const [pulseSensitivity, setPulseSensitivity] = useState<string>();
  const { toggleGlobalLoader } = useGlobalLoaderActions();
  const { tryDeviceControl } = useDeviceControl();

  const handleUpdateSuccess = () => {
    console.log("Device Updated Successfully");
  };

  const handleUpdateError = () => {
    console.log("Failure");
  };

  React.useEffect(() => {
    toggleGlobalLoader({ visible: isFetching || isLoading });
  }, [isLoading, isFetching]);

  const isDisabled = device_item?.is_online == 0;

  const handleSubmit = () => {
    tryDeviceControl({
      device_id: device_item?.id,
      pulse_speed: pulseSensitivity,
      fence_sensitivity: fenseSensitivity,
      voltage: voltage,
      type: IDeviceSubItemNames.CONFIGURATIONS,
      onDeviceControlError: handleUpdateError,
      onDeviceControlSuccess: handleUpdateSuccess,
    });
  };

  React.useEffect(() => {
    if (!isLoading && !isFetching && device_item) {
      setVoltage(extractSelectedFromList(voltageList, device_item?.voltage));
      setFenseSensitivity(
        extractSelectedFromList(voltageList, device_item?.fence_sensitivity)
      );
      setPulseSensitivity(
        extractSelectedFromList(voltageList, device_item?.pulse_speed)
      );
    }
  }, [isLoading, device_item, isFetching, setVoltage]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerTitle: "Device Configurations Settings",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <BackArrowIcon color={theme.colors.gray[900]} />
        </TouchableOpacity>
      ),
      headerRight: () => <></>,
      headerTitleAlign: "center",
    });
  }, [theme, navigation, headerTitleStyle]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background[900] }}
    >
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View>
              <Text
                style={{
                  color: theme.colors.text[900],
                  fontFamily: fontFamily.medium,
                  fontSize: 16,
                  lineHeight: 24,
                  marginRight: 6,
                }}
                numberOfLines={2}
              >
                {`${device_item?.name ?? ""}`}
              </Text>
              <Text
                style={{
                  color: theme.colors.text[800],
                  fontFamily: fontFamily.regular,
                  fontSize: 16,
                  lineHeight: 24,
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {`IMEI no. : ${device_item?.sn ?? ""}`}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
        >
          <Text
            style={{
              color: theme.colors.text[850],
              fontFamily: fontFamily.regular,
              fontSize: 16,
              lineHeight: 24,
              marginRight: 6,
            }}
          >
            {"Set Voltage"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 8,
            borderBottomWidth: 1,
            borderColor: theme.colors.border[900],
            paddingBottom: 16,
          }}
        >
          {voltageList.map((item, index) => {
            const unit = "KV";
            const isSelected = item == voltage;
            return (
              <TouchableOpacity
                key={`Voltage ${item} ${index}`}
                onPress={() => {
                  setVoltage(item);
                }}
                style={{
                  flex: 1,
                  backgroundColor: isSelected
                    ? theme.colors.primary[900]
                    : theme.colors.background[950],
                  borderRadius: 6,
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 2,
                  borderWidth: 1,
                  borderColor: theme.colors.border[900],
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    color: isSelected
                      ? theme.colors.white[900]
                      : theme.colors.text[900],
                    fontFamily: fontFamily.medium,
                  }}
                >{`${item}${unit}`}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
        >
          <Text
            style={{
              color: theme.colors.text[850],
              fontFamily: fontFamily.regular,
              fontSize: 16,
              lineHeight: 24,
              marginRight: 6,
            }}
          >
            {"Set Fence Sensitivity"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 8,
            borderBottomWidth: 1,
            borderColor: theme.colors.border[900],
            paddingBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {fenseSensitivityList.map((item, index) => {
            const isSelected = item == fenseSensitivity;
            return (
              <TouchableOpacity
                key={`Voltage ${item} ${index}`}
                onPress={() => {
                  setFenseSensitivity(item);
                }}
                style={{
                  backgroundColor: isSelected
                    ? theme.colors.primary[900]
                    : theme.colors.background[950],
                  borderRadius: 6,
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 2,
                  width: (SCREEN_WIDTH - 44) / 3,
                  marginVertical: 2,
                  borderWidth: 1,
                  borderColor: theme.colors.border[900],
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    color: isSelected
                      ? theme.colors.white[900]
                      : theme.colors.text[900],
                    fontFamily: fontFamily.medium,
                  }}
                >{`Level ${item}`}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
        >
          <Text
            style={{
              color: theme.colors.text[850],
              fontFamily: fontFamily.regular,
              fontSize: 16,
              lineHeight: 24,
              marginRight: 6,
            }}
          >
            {"Pulse Speed"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 8,
            borderBottomWidth: 1,
            borderColor: theme.colors.border[900],
            paddingBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {pulseSensitivityList.map((item, index) => {
            const isSelected = item == pulseSensitivity;
            return (
              <TouchableOpacity
                key={`Voltage ${item} ${index}`}
                onPress={() => {
                  setPulseSensitivity(item);
                }}
                style={{
                  backgroundColor: isSelected
                    ? theme.colors.primary[900]
                    : theme.colors.background[950],
                  borderRadius: 6,
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 2,
                  width: (SCREEN_WIDTH - 44) / 3,
                  marginVertical: 2,
                  borderWidth: 1,
                  borderColor: theme.colors.border[900],
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    color: isSelected
                      ? theme.colors.white[900]
                      : theme.colors.text[900],
                    fontFamily: fontFamily.medium,
                  }}
                >{`Level ${item}`}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            marginTop: 36,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              backgroundColor: theme.colors.background[600],
              flex: 1,
              height: 50,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginRight: 4,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: theme.colors.text[900],
                fontFamily: fontFamily.semiBold,
                fontSize: 14,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={__DEV__ ? false : isDisabled}
            style={{
              backgroundColor: theme.colors.primary[900],
              opacity: !__DEV__ && isDisabled ? 0.7 : 1,
              height: 50,
              borderRadius: 8,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              flexDirection: "row",
              marginLeft: 4,
            }}
          >
            <Text
              style={{
                color: theme.colors.white[900],
                fontFamily: fontFamily.semiBold,
                fontSize: 14,
              }}
            >
              {"Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export { DeviceConfigurationSetting };
