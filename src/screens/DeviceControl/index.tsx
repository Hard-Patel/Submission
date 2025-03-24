import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Linking,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { RootStackScreenProps } from "interface/navigation";
import { fontFamily, useAppTheme } from "theme";
import { useStyleUtils } from "hooks";
import {
  BackArrowIcon,
  CallActionIcon,
  CallIcon,
  CheckedPrimaryIcon,
  OfflineIcon,
  OnlineIcon,
  PrimaryArrowRightIcon,
} from "assets/svg";
import {
  DeviceControlSubItems,
  IDeviceSubItemNames,
} from "./DeviceControlSubItems";
import { getChargingState, getFenceState } from "utils/globals.functions";
import { useDeviceDetailsQuery } from "hooks/apiHelpers/useDeviceDetails";
import { useDeviceControl } from "hooks/apiHelpers/useDeviceControl";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { I_ROLE_SC } from "interface/user";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { useUtils } from "hooks/useUtils";
import { SCREEN_WIDTH } from "../../constants";

const DeviceControl = (props: RootStackScreenProps<"DeviceControl">) => {
  const { navigation, route } = props;
  const device_id = route?.params?.device_id ?? "";
  console.log("device_id: ", device_id);
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();
  const { showToast } = useUtils();

  const [fence, setFence] = useState(false);
  const [siren, setSiren] = useState(false);
  const { tryDeviceControl } = useDeviceControl();
  const { toggleGlobalLoader } = useGlobalLoaderActions();

  const user = useSelector((state: RootState) => state.user);
  const role_sc = user?.user?.profile?.role_sc;

  const handleDeviceControlPress = (item: IDeviceSubItemNames) => {
    if (
      item != IDeviceSubItemNames.AUTO_CONTROL &&
      Boolean(device_item.auto_control)
    ) {
      showToast({ message: "Device is currently in auto control mode" });
      return;
    }
    if (item == IDeviceSubItemNames.FENCING_POWER) {
      tryDeviceControl({
        device_id,
        fencing_power: device_item?.fencing_power ? 0 : 1,
        type: item,
      });
    } else if (item == IDeviceSubItemNames.SIREN) {
      tryDeviceControl({
        device_id,
        siren: device_item?.siren ? 0 : 1,
        type: item,
      });
    } else if (item == IDeviceSubItemNames.AUTO_CONTROL) {
      tryDeviceControl({
        device_id,
        auto_control: device_item?.auto_control ? 0 : 1,
        type: item,
      });
    }
  };

  const { data, isLoading, isFetching } = useDeviceDetailsQuery({
    device_id: device_id,
  });
  const device_item = data?.data?.userDetail;
  console.log('device_item: ', device_item);

  React.useEffect(() => {
    toggleGlobalLoader({ visible: isFetching || isLoading });
  }, [isLoading, isFetching]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerTitle: "Device Information",
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
                  width: SCREEN_WIDTH * 0.75,
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
          <Pressable
            onPress={() => {
              Linking.openURL(`tel:${device_item?.call_to_action}`);
            }}
          >
            <CallActionIcon />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 4,
          }}
        >
          {device_item?.is_online ? <OnlineIcon /> : <OfflineIcon />}
          <Text
            style={{
              color: theme.colors.text[900],
              fontFamily: fontFamily.regular,
              fontSize: 14,
              lineHeight: 21,
              marginLeft: 6,
            }}
          >
            {`${device_item?.is_online ? "Online" : "Offline"}`}
          </Text>
        </View>
        <View>
          <DeviceControlSubItems
            name="Auto Control"
            type={2}
            isLoading={device_item?.auto_control_loading}
            status={Boolean(device_item?.auto_control)}
            setStatus={() => {
              handleDeviceControlPress(IDeviceSubItemNames.AUTO_CONTROL);
            }}
            item={IDeviceSubItemNames.AUTO_CONTROL}
          />
          <DeviceControlSubItems
            name="Fencing Power"
            type={2}
            isLoading={device_item?.fencing_power_loading}
            status={Boolean(device_item?.fencing_power)}
            setStatus={() =>
              handleDeviceControlPress(IDeviceSubItemNames.FENCING_POWER)
            }
            item={IDeviceSubItemNames.FENCING_POWER}
          />
          <DeviceControlSubItems
            name="Fence Voltage (V)"
            type={1}
            state={`${device_item?.voltage ?? 0} KV`}
            color={theme.colors.primary[900]}
            item={IDeviceSubItemNames.FENCE_VOLTAGE}
          />
          <DeviceControlSubItems
            name="Siren"
            type={2}
            isLoading={device_item?.siren_loading}
            status={Boolean(device_item?.siren)}
            setStatus={() =>
              handleDeviceControlPress(IDeviceSubItemNames.SIREN)
            }
            item={IDeviceSubItemNames.SIREN}
          />
          <DeviceControlSubItems
            name="Fence State"
            type={1}
            state={getFenceState(device_item?.fence_status)}
            color={theme.colors.primary[900]}
            item={IDeviceSubItemNames.FENCE_STATE}
          />
          <DeviceControlSubItems
            name="Battery Voltage (V)"
            type={1}
            state={`${device_item?.battery_voltage ?? 0}`}
            color={theme.colors.primary[900]}
            item={IDeviceSubItemNames.BATTERY_COLTAGE}
          />
          <DeviceControlSubItems
            name="Charging Status"
            type={1}
            state={getChargingState(device_item?.charge_status)}
            color={theme.colors.green[900]}
            item={IDeviceSubItemNames.CHARGING_STATUS}
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 21,
              color: theme.colors.text[800],
              fontFamily: fontFamily.medium,
            }}
          >
            More Settings
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DeviceConfigurationSetting", { device_id });
            }}
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderColor: theme.colors.border[900],
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                color: theme.colors.text[900],
                fontFamily: fontFamily.medium,
              }}
            >
              Device Configurations Settings
            </Text>
            <PrimaryArrowRightIcon />
          </TouchableOpacity>
          {role_sc == I_ROLE_SC.OWNER ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditDeviceInformation", {
                  device_id: device_item.id,
                  edit: true,
                });
              }}
              style={{
                paddingVertical: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  color: theme.colors.text[900],
                  fontFamily: fontFamily.medium,
                }}
              >
                Device Information Edit
              </Text>
              <PrimaryArrowRightIcon />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export { DeviceControl };
