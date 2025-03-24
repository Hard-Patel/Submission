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
import { DropdownIcon } from "assets/svg";
import { HeaderLeft } from "components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskInput from "react-native-mask-input";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  IUserValues,
  useUserForm,
} from "screens/AddUpdateUserScreen/useUserForm";
import { useUserDetailsQuery } from "hooks/apiHelpers/useUserDetails";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useUserDetailsUpdate } from "hooks/apiHelpers/useUserDetailUpdateQuery";
import { useGlobalLoaderActions } from "../../redux/globalLoader";

const EditProfile = (props: RootStackScreenProps<"EditProfile">) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();

  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [visible, setVisible] = useState<boolean>(false);

  const { toggleGlobalLoader } = useGlobalLoaderActions();

  const user = useSelector((state: RootState) => state.user.user);
  const user_id = user?.profile?.user_id ?? "";

  const { triggerUserDetailsGet, data, isLoading } = useUserDetailsQuery({
    user_id,
  });
  const { tryUpdateUserDetails, isLoading: isUpdatingUser } =
    useUserDetailsUpdate();

  const userData = data?.data?.userDetail;

  React.useEffect(() => {
    triggerUserDetailsGet({ user_id });
  }, [user_id]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerTitleAlign: "center",
      headerShadowVisible: false,
      headerTitle: "Edit Profile",
      headerLeft: () => <HeaderLeft onPress={navigation.goBack} />,
    });
  }, [theme, navigation, headerTitleStyle]);

  const handleSuccess = () => {
    triggerUserDetailsGet({ user_id });
  };

  const handleError = () => {
    triggerUserDetailsGet({ user_id });
  };

  const handlePress = (values: IUserValues) => {
    console.log("values: ", values);
    const userDetails = {
      address: values.address,
      first_name: values.first_name,
      last_name: values.last_name,
      pincode: values.pincode,
      email: values.email,
    };
    tryUpdateUserDetails({
      userDetailsUpdate: userDetails,
      user_id: user_id,
      edit: true,
      onEditUserError: handleError,
      onEditUserSuccess: handleSuccess,
    });
  };

  const { values, errors, setValues, resetForm, setFieldValue, handleSubmit } =
    useUserForm({
      onSubmit: handlePress,
    });

    React.useEffect(() => {
      toggleGlobalLoader({ visible: isLoading });
    }, [isLoading]);

  React.useEffect(() => {
    if (userData) {
      const values: IUserValues = {
        address: userData.profile.address,
        country: userData.phone_iso,
        first_name: userData.profile.first_name,
        last_name: userData.profile.last_name,
        devices: userData.DeviceRel,
        email: userData?.email ?? "",
        phoneNumber: userData.phone,
        pincode: userData.profile.pincode,
      };
      setValues(values);
    }
  }, [userData, isLoading]);

  const onSelect = (country: Country) => {
    setCountryCode(countryCode);
    setFieldValue("country", country.callingCode[0]);
    onDismiss();
  };

  const onDismiss = () => {
    setVisible(false);
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      showsVerticalScrollIndicator={false}
      extraScrollHeight={30}
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
            disabled
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
                paddingLeft: 2,
                color: theme.colors.text[800],
                fontSize: 16,
                fontFamily: fontFamily.medium,
              }}
            >
              {`${values.country} `}
            </Text>
            <DropdownIcon color={theme.colors.text[800]} />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              marginLeft: 8,
            }}
          >
            <MaskInput
              value={values.phoneNumber}
              onChangeText={(masked, unmasked) => {
                setFieldValue("phoneNumber", unmasked);
              }}
              editable={false}
              style={{
                backgroundColor: theme.colors.background[950],
                borderRadius: 6,
                paddingHorizontal: 18,
                color: theme.colors.text[800],
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
              maxLength={18}
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
      <View style={{ width: "100%", marginTop: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamily.regular,
            lineHeight: 27,
            color: theme.colors.text[700],
          }}
        >
          Email Address:
        </Text>
        <TextInput
          value={values.email}
          onChangeText={(e) => {
            setFieldValue("email", e);
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
        {errors.email && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.state.failure,
              fontFamily: fontFamily.regular,
              paddingHorizontal: 4,
              paddingTop: 2,
            }}
          >
            {errors.email}
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
          Address:
        </Text>
        <TextInput
          value={values.address}
          onChangeText={(e) => {
            setFieldValue("address", e);
          }}
          multiline
          style={{
            backgroundColor: theme.colors.background[950],
            paddingHorizontal: 14,
            height: 80,
            marginTop: 8,
            paddingVertical: 10,
            textAlignVertical: "top",
            borderRadius: 8,
            fontSize: 16,
            fontFamily: fontFamily.medium,
            lineHeight: 24,
            color: theme.colors.text[900],
            borderColor: theme.colors.border[900],
            borderWidth: 1,
          }}
        />
        {errors.address && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.state.failure,
              fontFamily: fontFamily.regular,
              paddingHorizontal: 4,
              paddingTop: 2,
            }}
          >
            {errors.address}
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
          Pincode:
        </Text>
        <TextInput
          value={values.pincode}
          onChangeText={(e) => {
            setFieldValue("pincode", e);
          }}
          maxLength={6}
          keyboardType="numeric"
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
        {errors.pincode && (
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.state.failure,
              fontFamily: fontFamily.regular,
              paddingHorizontal: 4,
              paddingTop: 2,
            }}
          >
            {errors.pincode}
          </Text>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            backgroundColor: theme.colors.background[600],
            marginTop: 18,
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
          onPress={() => {
            handleSubmit();
          }}
          disabled={isUpdatingUser}
          style={{
            backgroundColor: theme.colors.primary[900],
            marginTop: 18,
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
          {isUpdatingUser ? (
            <ActivityIndicator
              color={theme.colors.white[900]}
              size={"small"}
            />
          ) : (
            <Text
              style={{
                color: theme.colors.white[900],
                fontFamily: fontFamily.semiBold,
                fontSize: 14,
              }}
            >
              {"Save Changes"}
            </Text>
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

export { EditProfile };
