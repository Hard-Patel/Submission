import {
  ILoginRequestType,
  ISendOTPResponseSuccessCallback,
} from 'interface/login';
import {ILoginValues} from './useLoginForm';
import {useLoginQuery} from 'hooks/apiHelpers/useLogin';
import {useUtils} from 'hooks/useUtils';
import {useNavigation} from '@react-navigation/native';
import {Keyboard} from 'react-native';
import Config from 'react-native-config';

export const useLoginService = ({
  navigation,
  shouldNavigateToOTP,
}: {
  navigation: any;
  shouldNavigateToOTP: boolean;
}) => {
  const {tryLoginRequest, isLoading} = useLoginQuery();
  const {showToast} = useUtils();

  const handleSuccess = ({
    otp,
    type,
    user_id,
    phoneNumber,
    email,
    country,
    phoneNumberMasked,
  }: ISendOTPResponseSuccessCallback) => {
    showToast({
      message: `OTP sent to your ${
        type == ILoginRequestType.EMAIL ? 'email' : 'mobile number'
      } successfully`,
      description: __DEV__ || Config.BASE_URL.includes('43.204.201.65:9001') ? otp.toString() : '',
    });
    if (shouldNavigateToOTP) {
      navigation.navigate('OTPVerification', {
        phoneNumber: phoneNumber,
        maskedPhoneNumber: phoneNumberMasked || '999 999 9999',
        country: country,
        otp: otp,
        type,
        email,
        user_id,
      });
    }
  };

  const handleError = () => {
    console.log('Failed request');
  };

  const handleSendOTP = (params: ILoginValues, type: ILoginRequestType) => {
    Keyboard.dismiss();
    tryLoginRequest({
      email: params.email,
      country: params.country,
      phoneNumberMasked: params.phoneNumberMasked,
      phoneNumber: params.phoneNumber,
      type: type,
      onSendOtp: handleSuccess,
      onSendOTPError: handleError,
    });
  };

  return {handleSendOTP, isLoading};
};
