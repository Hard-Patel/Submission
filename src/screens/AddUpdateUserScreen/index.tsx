import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { RootStackScreenProps } from "interface/navigation";
import { fontFamily, useAppTheme } from "theme";
import { useStyleUtils } from "hooks";
import { AddIcon, DropdownIcon } from "assets/svg";
import { HeaderLeft } from "components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IUserValues, useUserForm } from "./useUserForm";
import MaskInput from "react-native-mask-input";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import AssignedDeviceItem from "../AssignDeviceScreeen/AssignedDeviceItem";
import { IDeviceRel } from "interface/device";
import { useUserDetailsUpdate } from "hooks/apiHelpers/useUserDetailUpdateQuery";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useUserDetailsQuery } from "hooks/apiHelpers/useUserDetails";
import { useAssignDevicesQuery } from "hooks/apiHelpers/useAssignDevice";
import { useFocusEffect } from "@react-navigation/native";
import { useGlobalLoaderActions } from "../../redux/globalLoader";

const AddUserScreen = (props: RootStackScreenProps<"AddUserScreen">) => {
  const {
    navigation,
    route: {
      params: { edit = false, user_id = "" },
    },
  } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();
  const { toggleGlobalLoader } = useGlobalLoaderActions();
  const { id: owner_id } = useSelector((state: RootState) => state.user.user);

  const { triggerUserDetailsGet, data, isLoading } = useUserDetailsQuery({
    user_id,
  });
  const { tryUpdateUserDetails, isLoading: isUpdatingUser } =
    useUserDetailsUpdate();
  const [countryCode, setCountryCode] = useState<CountryCode>();
  const [visible, setVisible] = useState<boolean>(false);

  const userData = data?.data?.userDetail;

  const { tryAssignDevices } = useAssignDevicesQuery();

  React.useEffect(() => {
    if (edit) {
      triggerUserDetailsGet({ user_id: user_id });
    }
  }, [edit]);

  useFocusEffect(
    React.useCallback(() => {
      if (edit) {
        triggerUserDetailsGet({ user_id: user_id });
      }
    }, [edit])
  );

  const handleSuccessAssign = () => {
    console.log("Success");
    triggerUserDetailsGet({ user_id: user_id });
  };

  const handleErrorAssign = () => {
    console.log("Failure");
  };

  React.useEffect(() => {
    toggleGlobalLoader({ visible: isLoading });
  }, [isLoading]);

  const handleUserDelete = (device_id: string) => {
    tryAssignDevices({
      user_id: user_id,
      remove_devices: [device_id],
      onAssignDeviceSuccess: handleSuccessAssign,
      onAssignDeviceError: handleErrorAssign,
    });
  };

  const handleSuccess = () => {
    resetForm();
    navigation.goBack();
  };
  const handleError = () => {};

  const handlePress = (values: IUserValues) => {
    const userDetails = {
      address: values.address,
      first_name: values.first_name,
      last_name: values.last_name,
      pincode: values.pincode,
    };
    if (!edit) {
      userDetails["phone"] = values.phoneNumber;
      userDetails["created_by"] = owner_id;
      userDetails["phone_iso"] = values.country;
    }
    tryUpdateUserDetails({
      userDetailsUpdate: userDetails,
      user_id: user_id,
      edit,
      onEditUserError: handleError,
      onEditUserSuccess: handleSuccess,
    });
  };
  const { values, resetForm, errors, setFieldValue, handleSubmit, setValues } =
    useUserForm({
      onSubmit: handlePress,
    });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerTitleAlign: "center",
      headerShadowVisible: false,
      headerTitle: edit ? "User Details" : "Add User",
      headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
    });
  }, [theme, navigation, headerTitleStyle]);

  React.useEffect(() => {
    if (userData) {
      const updatedValues: IUserValues = {
        address: userData.profile.address,
        country: userData.phone_iso,
        first_name: values?.first_name || userData.profile.first_name,
        last_name: values?.last_name || userData.profile.last_name,
        devices: userData.DeviceRel,
        email: userData?.email ?? "",
        phoneNumber: userData.phone,
        pincode: userData.profile.pincode,
      };
      console.log("values: ", updatedValues);
      setValues(updatedValues);
    }
  }, [userData, isLoading]);

  const onSelect = (country: Country) => {
    setCountryCode(countryCode);
    setFieldValue("country", country.callingCode[0]);
    setVisible(false);
  };

  const onDismiss = () => {
    setVisible(false);
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps={"handled"}
      showsVerticalScrollIndicator={false}
      extraScrollHeight={50}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background[900],
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      onKeyboardWillShow={(frames: Object) => {
        console.log("Keyboard event", frames);
      }}
    >
      <View style={{ width: "100%", marginTop: 4 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.regular,
            lineHeight: 27,
            color: theme.colors.text[700],
          }}
        >
          First Name:
        </Text>
        <TextInput
          value={values.first_name}
          onChangeText={(e) => {
            setFieldValue("first_name", e);
          }}
          style={{
            backgroundColor: theme.colors.background[950],
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginTop: 8,
            borderRadius: 8,
            fontSize: 16,
            fontFamily: fontFamily.medium,
            lineHeight: 24,
            color: theme.colors.text[900],
            borderColor: theme.colors.border[900],
            borderWidth: 1,
          }}
        />
        {errors.first_name && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.state.failure,
              fontFamily: fontFamily.regular,
              paddingHorizontal: 4,
              paddingTop: 2,
            }}
          >
            {errors.first_name}
          </Text>
        )}
      </View>
      <View style={{ width: "100%", marginTop: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.regular,
            lineHeight: 27,
            color: theme.colors.text[700],
          }}
        >
          Last Name:
        </Text>
        <TextInput
          value={values.last_name}
          onChangeText={(e) => {
            setFieldValue("last_name", e);
          }}
          style={{
            backgroundColor: theme.colors.background[950],
            paddingHorizontal: 14,
            marginTop: 8,
            paddingVertical: 10,
            borderRadius: 8,
            fontSize: 16,
            fontFamily: fontFamily.medium,
            lineHeight: 24,
            color: theme.colors.text[900],
            borderColor: theme.colors.border[900],
            borderWidth: 1,
          }}
        />
        {errors.last_name && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.state.failure,
              fontFamily: fontFamily.regular,
              paddingHorizontal: 4,
              paddingTop: 2,
            }}
          >
            {errors.last_name}
          </Text>
        )}
      </View>
      <View style={{ width: "100%", marginTop: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.regular,
            lineHeight: 27,
            color: theme.colors.text[700],
          }}
        >
          Mobile Number:
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
            disabled={edit}
            style={{
              backgroundColor: theme.colors.background[950],
              paddingHorizontal: 8,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 6,
              height: 50,
              borderWidth: 1,
              borderColor: theme.colors.border[900],
            }}
          >
            <Text
              style={{
                lineHeight: 24,
                marginRight: 2,
                color: edit ? theme.colors.text[800] : theme.colors.text[900],
                fontSize: 16,
                fontFamily: fontFamily.medium,
              }}
            >
              {`${values.country} `}
            </Text>
            <DropdownIcon
              color={edit ? theme.colors.text[800] : theme.colors.text[900]}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              marginLeft: 8,
            }}
          >
            <MaskInput
              value={values.phoneNumber}
              editable={!edit}
              onChangeText={(masked, unmasked) => {
                setFieldValue("phoneNumber", unmasked);
              }}
              style={{
                backgroundColor: theme.colors.background[950],
                borderRadius: 6,
                paddingHorizontal: 18,
                color: edit ? theme.colors.text[800] : theme.colors.text[900],
                fontSize: 16,
                paddingVertical: 12,
                fontFamily: fontFamily.medium,
                height: 50,
                alignItems: "center",
                textAlignVertical: "center",
                borderWidth: 1,
                borderColor: theme.colors.border[900],
              }}
              placeholderTextColor={theme.colors.text[800]}
              maxLength={10}
              inputMode="numeric"
            />
            {errors && errors.phoneNumber && (
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.state.failure,
                  fontFamily: fontFamily.regular,
                  paddingHorizontal: 16,
                  paddingTop: 2,
                }}
              >
                {errors.phoneNumber}
              </Text>
            )}
          </View>
        </View>
      </View>
      {edit && (
        <>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fontFamily.regular,
              lineHeight: 27,
              color: theme.colors.text[700],
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            Assigned Devices:
          </Text>
          <View
            style={{
              backgroundColor: theme.colors.background[950],
              borderRadius: 8,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderColor: theme.colors.border[900],
              borderWidth: 1,
            }}
          >
            {values.devices.map((device: IDeviceRel, index: number) => {
              return (
                <AssignedDeviceItem
                  device={device}
                  index={index}
                  handleUserDelete={handleUserDelete}
                  isLastItem={index == values.devices.length - 1}
                />
              );
            })}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddDeviceScreen", {
                  user_id: user_id,
                  device_list: userData.DeviceRel.map((v) => v.device_id),
                });
              }}
              style={{
                backgroundColor: theme.colors.black[900],
                width: "100%",
                marginTop: 0,
                height: 40,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddIcon />
                <Text
                  style={{
                    color: theme.colors.white[900],
                    fontFamily: fontFamily.semiBold,
                    fontSize: 14,
                    lineHeight: 24,
                    marginLeft: 6,
                  }}
                >
                  Assign New Device
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
      <View style={{ width: "100%", marginTop: 12 }}>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          disabled={isUpdatingUser}
          style={{
            backgroundColor: theme.colors.primary[900],
            width: "100%",
            marginTop: 18,
            height: 50,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            flexDirection: "row",
          }}
        >
          {!isUpdatingUser ? (
            <Text
              style={{
                color: theme.colors.white[900],
                fontFamily: fontFamily.semiBold,
                fontSize: 14,
                lineHeight: 24,
              }}
            >
              {edit ? "Update User" : "Add User"}
            </Text>
          ) : (
            <ActivityIndicator color={theme.colors.white[900]} size={"small"} />
          )}
        </TouchableOpacity>
      </View>
      <CountryPicker
        countryCode={countryCode}
        withFilter
        withFlag
        visible={visible}
        onSelect={onSelect}
        onClose={onDismiss}
        containerButtonStyle={{ height: 0, width: 0 }}
      />
    </KeyboardAwareScrollView>
  );
};

export { AddUserScreen };
