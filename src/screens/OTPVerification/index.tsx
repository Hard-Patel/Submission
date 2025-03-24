import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import OTPTextView from "react-native-otp-textinput";
import { RootStackScreenProps } from "interface/navigation";
import { fontFamily, useAppTheme } from "theme";
import { BrandLogo } from "components/Header";
import { useStyleUtils } from "hooks";
import { useVerify } from "hooks/apiHelpers/useVerify";
import { isAndroid } from "../../constants";
import { CommonActions } from "@react-navigation/native";
import { useLoginService } from "screens/LoginScreen/useLoginService";
import { useKeyboard } from "hooks/useKeyboard";
import { FCMManager } from "../../notification";
import { ILoginValues } from "screens/LoginScreen/useLoginForm";
import { ILoginRequestType } from "interface/login";
import BackgroundTimer from "react-native-background-timer";
import { TimerIcon } from "assets/svg";

export function OTPVerification(
  props: RootStackScreenProps<"OTPVerification">
) {
  const {
    navigation,
    route: {
      params: { phoneNumber, country, user_id = "", email, maskedPhoneNumber, type },
    },
  } = props;
  const theme = useAppTheme();
  const { headerTitleStyle } = useStyleUtils();

  const [OTPCode, setOTPCode] = useState("");
  const [OTPCodeError, setOTPCodeError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [interval, setIntervalRef] = useState(null);

  const { tryVerifyUser, data, isLoading } = useVerify();

  const { keyboardHeight, keyboardShown } = useKeyboard();

  const { handleSendOTP } = useLoginService({
    navigation,
    shouldNavigateToOTP: false,
  });

  const startTimer = useCallback(() => {
    setTimeLeft(30);
    let inter = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((it) => it - 1);
      }
    }, 1000);
    setIntervalRef(inter)
  }, []);

  React.useEffect(() => {
    startTimer();
  }, []);
  
  React.useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(interval)
    }
  }, [timeLeft]);

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

  const handleSuccess = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Tabs",
          },
        ],
      })
    );
    setOTPCodeError("");
  };

  const handleError = () => {
    console.log("OTP didn't verify");
  };

  const handleVerifyPress = async () => {
    const fcm_token = FCMManager?.fcmToken || "";
    if (OTPCode.length == 4) {
      tryVerifyUser({
        onVerifyOTP: handleSuccess,
        onVerifyOTPError: handleError,
        device_token: fcm_token,
        device_type: isAndroid ? 1 : 2,
        otp: OTPCode,
        user_id: user_id,
      });
    } else {
      setOTPCodeError("Please enter valid OTP");
    }
  };

  const handleResendOTP = () => {
    const loginValues: ILoginValues = {
      country,
      phoneNumber,
      phoneNumberMasked: maskedPhoneNumber,
      email: email,
    };
    startTimer()
    handleSendOTP(loginValues, type);
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
            fontSize: 20,
            fontFamily: fontFamily.medium,
            lineHeight: 30,
          }}
        >
          OTP Verification
        </Text>
        <Text
          style={{
            color: theme.colors.text[800],
            fontSize: 14,
            fontFamily: fontFamily.regular,
            lineHeight: 21,
            marginTop: 8,
            marginBottom: 20,
          }}
        >
          {`Enter the OTP sent to `}
          <Text
            style={{
              color: theme.colors.text[900],
            }}
          >{`${
            type == ILoginRequestType.MOBILE
              ? `+${country} ${phoneNumber}`
              : `${email}`
          }`}</Text>
        </Text>
        <View
          style={{ width: "85%", alignItems: "center", alignSelf: "center" }}
        >
          <OTPTextView
            autoFocus
            handleTextChange={setOTPCode}
            textInputStyle={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.colors.primary[900],
              borderBlockColor: theme.colors.primary[900],
              backgroundColor: theme.colors.background[950],
              height: 60,
              width: 60,
              borderBottomWidth: 1,
            }}
            tintColor={theme.colors.primary[900]}
            offTintColor={theme.colors.border[900]}
            containerStyle={{
              width: "100%",
              justifyContent: "space-between",
            }}
          />
          {OTPCodeError && (
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.state.failure,
                fontFamily: fontFamily.regular,
                marginTop: 12,
              }}
            >
              {OTPCodeError}
            </Text>
          )}
        </View>
      </View>
      <View style={{ marginBottom: keyboardShown ? keyboardHeight + 18 : 18 }}>
        <TouchableOpacity
          onPress={handleVerifyPress}
          disabled={isLoading}
          style={{
            backgroundColor: theme.colors.primary[900],
            width: "100%",
            marginBottom: 12,
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
              Verify
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          {timeLeft ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <TimerIcon />
              <Text
                style={{
                  color: theme.colors.text[800],
                  fontFamily: fontFamily.regular,
                  fontSize: 16,
                  lineHeight: 24,
                }}
              >
                {` ${timeLeft} Seconds Left`}
              </Text>
            </View>
          ) : (
            <>
              <Text
                style={{
                  color: theme.colors.text[800],
                  fontFamily: fontFamily.regular,
                  fontSize: 16,
                  lineHeight: 24,
                }}
              >
                {`Didn't receive OTP? `}
              </Text>
              <TouchableOpacity onPress={handleResendOTP}>
                <Text
                  style={{
                    color: theme.colors.primary[900],
                    fontFamily: fontFamily.medium,
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                >{`Resend`}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
