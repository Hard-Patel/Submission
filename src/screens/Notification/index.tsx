import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { RootStackScreenProps, RootTabScreenProps } from "interface/navigation";
import { fontFamily, useAppTheme } from "theme";
import { useStyleUtils } from "hooks";
import {
  CorrectIcon,
  PrimaryArrowRightIcon,
  PrimarySwitchOffIcon,
  PrimarySwitchOnIcon,
  SearchtoptabIcon,
} from "assets/svg";
import { CommonActions } from "@react-navigation/native";
import { HeaderLeft } from "components/Header";
import { useNotificationPreferenceUpdateQuery } from "hooks/apiHelpers/useNotificationPreference";
import { INotificationPreferenceRequest } from "interface/user";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { useUserDetailsUpdate } from "hooks/apiHelpers/useUserDetailUpdateQuery";
import { useUserDetailsQuery } from "hooks/apiHelpers/useUserDetails";

const NotificationPreference = (
  props: RootStackScreenProps<"NotificationPreference">
) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();

  const user = useSelector((state: RootState) => state.user.user);
  const { toggleGlobalLoader } = useGlobalLoaderActions();

  const {
    triggerUserDetailsGet,
    data,
    isLoading: isUserDetailsLoading,
  } = useUserDetailsQuery({
    user_id: user?.profile?.user_id ?? "",
  });
  const userData = data?.data?.userDetail;

  const {
    user_id = "",
    battery_discharge_alert,
    battery_low_alert,
    enz_status_auto_alert,
    enz_status_off_alert,
    enz_status_on_alert,
    fence_fault_alert,
    fence_normal_alert,
  } = user?.profile ?? {};

  const [energizerStatusON, setEnergizerStatusON] = useState(
    Boolean(enz_status_on_alert)
  );
  const [energizerStatusOFF, setEnergizerStatusOFF] = useState(
    Boolean(enz_status_off_alert)
  );
  const [energizerStatusAuto, setEnergizerStatusAuto] = useState(
    Boolean(enz_status_auto_alert)
  );

  const [fenceBatteryLow, setFenceBatteryLow] = useState(
    Boolean(battery_low_alert)
  );
  const [fenceBatteryDischarge, setFenceBatteryDischarge] = useState(
    Boolean(battery_discharge_alert)
  );

  const [fenceStatusNormal, setFenceStatusNormal] = useState(
    Boolean(fence_normal_alert)
  );
  const [fenceStatusFault, setFenceStatusFault] = useState(
    Boolean(fence_fault_alert)
  );

  const { tryNotificationPreferenceUpdateRequest, isLoading } =
    useNotificationPreferenceUpdateQuery();

  const handleNotificationSubmit = () => {
    const data: INotificationPreferenceRequest = {
      user_id,
      battery_discharge_alert: fenceBatteryDischarge ? 1 : 0,
      battery_low_alert: fenceBatteryLow ? 1 : 0,
      enz_status_auto_alert: energizerStatusAuto ? 1 : 0,
      enz_status_off_alert: energizerStatusOFF ? 1 : 0,
      enz_status_on_alert: energizerStatusON ? 1 : 0,
      fence_fault_alert: fenceStatusFault ? 1 : 0,
      fence_normal_alert: fenceStatusNormal ? 1 : 0,
    };

    tryNotificationPreferenceUpdateRequest(data);
  };

  React.useEffect(() => {
    triggerUserDetailsGet({ user_id });
  }, [user_id]);

  React.useEffect(() => {
    toggleGlobalLoader({ visible: isUserDetailsLoading });
    if (!isUserDetailsLoading && userData) {
      const {
        battery_discharge_alert,
        battery_low_alert,
        enz_status_auto_alert,
        enz_status_off_alert,
        enz_status_on_alert,
        fence_fault_alert,
        fence_normal_alert,
      } = userData?.profile;
      setEnergizerStatusAuto(Boolean(enz_status_auto_alert))
      setEnergizerStatusON(Boolean(enz_status_on_alert))
      setEnergizerStatusOFF(Boolean(enz_status_off_alert))
      setFenceBatteryDischarge(Boolean(battery_discharge_alert))
      setFenceBatteryLow(Boolean(battery_low_alert))
      setFenceStatusFault(Boolean(fence_fault_alert))
      setFenceStatusNormal(Boolean(fence_normal_alert))
    }
  }, [isUserDetailsLoading, userData]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerTitle: "Notification Preference",
      headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
      headerRight: () => (
        <TouchableOpacity
          disabled={isLoading}
          onPress={handleNotificationSubmit}
        >
          {isLoading ? (
            <ActivityIndicator
              size={"small"}
              color={theme.colors.primary[900]}
            />
          ) : (
            <CorrectIcon />
          )}
        </TouchableOpacity>
      ),
    });
  }, [
    theme,
    navigation,
    headerTitleStyle,
    isLoading,
    handleNotificationSubmit,
  ]);

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background[900],
      }}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <NotificationTitle title={"Energizer Status"} />
      <NotificationItem
        status={energizerStatusON}
        setStatus={setEnergizerStatusON}
        type="ON Alert"
      />
      <NotificationItem
        status={energizerStatusOFF}
        setStatus={setEnergizerStatusOFF}
        type="OFF Alert"
      />
      <NotificationItem
        status={energizerStatusAuto}
        setStatus={setEnergizerStatusAuto}
        type="AUTO Alert"
      />
      <NotificationTitle title={"Battery Status"} />
      <NotificationItem
        status={fenceBatteryDischarge}
        setStatus={setFenceBatteryDischarge}
        type="Battery Discharge"
      />
      <NotificationItem
        status={fenceBatteryLow}
        setStatus={setFenceBatteryLow}
        type="Battery LOW"
      />
      <NotificationTitle title={"Fence Status"} />
      <NotificationItem
        status={fenceStatusNormal}
        setStatus={setFenceStatusNormal}
        type="Normal"
      />
      <NotificationItem
        status={fenceStatusFault}
        setStatus={setFenceStatusFault}
        type="Fault"
      />
    </ScrollView>
  );
};

const NotificationTitle = (props: { title: string }) => {
  const { title } = props;
  const theme = useAppTheme();
  return (
    <Text
      style={{
        fontSize: 16,
        fontFamily: fontFamily.semiBold,
        lineHeight: 24,
        color: theme.colors.text[900],
        marginLeft: 4,
        marginTop: 14,
      }}
    >
      {title}
    </Text>
  );
};

const NotificationItem = ({
  type,
  setStatus,
  status,
}: {
  type: string;
  status: boolean;
  setStatus: (status: boolean) => void;
}) => {
  const theme = useAppTheme();
  return (
    <View>
      <View
        style={{
          backgroundColor: theme.colors.background[950],
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 8,
          width: "100%",
          // height: 50,
          marginTop: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.medium,
            lineHeight: 24,
            color: theme.colors.text[900],
          }}
        >
          {type}
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
            backgroundColor: theme.colors.background[900],
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: !status ? fontFamily.medium : fontFamily.regular,
              lineHeight: 24,
              color: !status
                ? theme.colors.primary[900]
                : theme.colors.text[850],
            }}
          >
            Notification
          </Text>
          <TouchableOpacity
            onPress={() => {
              setStatus(!status);
            }}
          >
            {status ? <PrimarySwitchOnIcon /> : <PrimarySwitchOffIcon />}
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 14,
              fontFamily: status ? fontFamily.medium : fontFamily.regular,
              lineHeight: 24,
              color: status
                ? theme.colors.primary[900]
                : theme.colors.text[850],
            }}
          >
            Ringing
          </Text>
        </View>
      </View>
    </View>
  );
};

export { NotificationPreference };
