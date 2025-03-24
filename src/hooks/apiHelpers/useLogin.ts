import { useUtils } from 'hooks/useUtils';
import { QueryKeys } from '../../api/QueryKeys';
import {tryLogin} from '../../api/api';
import {ILoginRequest} from 'interface/login';
import {useMutation} from 'react-query';
import { useGlobalLoaderActions } from '../../redux/globalLoader';
import { getErrorMessage } from 'utils/globals.functions';

export const useLoginQuery = () => {
  const cacheKey = QueryKeys.Login;
  const {showToast} = useUtils();
  const {toggleGlobalLoader} = useGlobalLoaderActions();

  const loginRequest = useMutation(cacheKey, tryLogin, {
    onSuccess: (
      {data: {otp, user_id}},
      {onSendOtp, email, phoneNumber, type, phoneNumberMasked, country},
    ) => {
      toggleGlobalLoader({visible: false})
      onSendOtp({
        phoneNumber,
        type,
        email,
        otp,
        user_id,
        phoneNumberMasked,
        country,
      });
    },
    onError: (error, {onSendOTPError}) => {
      toggleGlobalLoader({visible: false})
      // @ts-ignore
      showToast({message: getErrorMessage(error?.message)})
      onSendOTPError();
    },
  });

  const tryLoginRequest = (props: ILoginRequest) => {
    loginRequest.mutate(props);
  };

  return {...loginRequest, tryLoginRequest};
};
