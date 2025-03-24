import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { fontFamily, useAppTheme } from "theme";
import { RootStackScreenProps } from "interface/navigation";
import { BrandLogo } from "components/Header";
import { useStyleUtils } from "../../hooks/index";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { DropdownIcon } from "assets/svg";
import MaskInput from "react-native-mask-input";
import { ILoginValues, useLoginForm } from "./useLoginForm";
import { useLoginService } from "./useLoginService";
import { useKeyboard } from "hooks/useKeyboard";
import { EMAIL_REGEX } from "../../constants";
import { ILoginRequestType } from "interface/login";

const LoginScreen = (props: RootStackScreenProps<"LoginScreen">) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();

  const { keyboardHeight, keyboardShown } = useKeyboard();

  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [visible, setVisible] = useState<boolean>(false);

  const [emailLogin, setEmailLogin] = useState<boolean>(false);

  const { handleSendOTP, isLoading } = useLoginService({
    navigation,
    shouldNavigateToOTP: true,
  });

  const handleSendOTPValidation = (params: ILoginValues) => {
    if (emailLogin) {
      if (EMAIL_REGEX.test(params.email)) {
        setFieldError("phoneNumber", "");
        setFieldError("email", "");
        handleSendOTP(params, ILoginRequestType.EMAIL);
      } else {
        setFieldError("email", "Please enter valid email address");
      }
    } else {
      if (params.phoneNumber?.length == 10) {
        setFieldError("phoneNumber", "");
        setFieldError("email", "");
        handleSendOTP(params, ILoginRequestType.MOBILE);
      } else {
        setFieldError("phoneNumber", "Please enter valid mobile number");
      }
    }
  };

  const { values, setFieldValue, handleSubmit, errors, setFieldError } =
    useLoginForm({
      onSubmit: handleSendOTPValidation,
    });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.background[900],
      },
      headerTitleStyle,
      headerShadowVisible: false,
      headerTitle: "",
      headerLeft: () => <BrandLogo />,
    });
  }, [theme, navigation]);

  const onSelect = (country: Country) => {
    setCountryCode(countryCode);
    setFieldValue("country", country.callingCode[0]);
    setVisible(false);
  };

  const onDismiss = () => {
    setVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background[900],
        paddingHorizontal: 16,
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text
          style={{
            color: theme.colors.text[900],
            fontFamily: fontFamily.medium,
            fontSize: 20,
            lineHeight: 30,
          }}
        >
          Enter your Phone Number
        </Text>
        <Text
          style={{
            color: theme.colors.text[800],
            fontFamily: fontFamily.regular,
            fontSize: 14,
            lineHeight: 21,
            marginTop: 4,
          }}
        >
          We will send you the 4 digit verification code.
        </Text>
        {!emailLogin ? (
          <View
            style={{
              marginTop: 30,
              flexDirection: "row",
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setVisible(true);
              }}
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
                  color: theme.colors.text[900],
                  fontSize: 16,
                  fontFamily: fontFamily.medium,
                }}
              >
                {`+ ${values.country} `}
              </Text>
              <DropdownIcon color={theme.colors.text[900]} />
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
                  setFieldValue("phoneNumberMasked", masked);
                }}
                placeholder={"Enter 10 digit mobile number"}
                style={{
                  backgroundColor: theme.colors.background[950],
                  borderRadius: 6,
                  paddingHorizontal: 18,
                  color: theme.colors.text[900],
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
                // mask={phoneNumberMask}
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
        ) : (
          <View
            style={{
              marginTop: 30,
              flexDirection: "row",
              width: "100%",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <TextInput
                editable={!isLoading}
                value={values.email}
                onChangeText={(email) => {
                  setFieldValue("email", email);
                }}
                placeholder={"Enter email address"}
                style={{
                  backgroundColor: theme.colors.background[950],
                  borderRadius: 6,
                  paddingHorizontal: 18,
                  color: theme.colors.text[900],
                  fontSize: 16,
                  paddingVertical: 12,
                  width: "100%",
                  fontFamily: fontFamily.medium,
                  height: 50,
                  alignItems: "center",
                  textAlignVertical: "center",
                  borderWidth: 1,
                  borderColor: theme.colors.border[900],
                }}
                placeholderTextColor={theme.colors.text[800]}
                inputMode="email"
              />
              {errors && errors.email && (
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.state.failure,
                    fontFamily: fontFamily.regular,
                    paddingHorizontal: 16,
                    paddingTop: 2,
                  }}
                >
                  {errors.email}
                </Text>
              )}
            </View>
          </View>
        )}
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity disabled={isLoading} onPress={() => setEmailLogin(!emailLogin)}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 14,
                color: theme.colors.primary[900],
                fontFamily: fontFamily.medium,
              }}
            >{`Login with ${!emailLogin ? "Email" : "Mobile"}`}</Text>
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
      </View>
      <TouchableOpacity
        disabled={isLoading}
        onPress={() => {
          handleSubmit();
        }}
        style={{
          backgroundColor: theme.colors.primary[900],
          width: "100%",
          marginBottom: keyboardShown ? keyboardHeight + 18 : 18,
          height: 50,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.white[900]} size={"small"} />
        ) : (
          <Text
            style={{
              color: theme.colors.white[900],
              fontFamily: fontFamily.semiBold,
              fontSize: 16,
              lineHeight: 24,
            }}
          >
            Send OTP
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export { LoginScreen };
