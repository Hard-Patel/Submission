import { tryLogin, verifyOtp } from "../../api/api";
import { ILoginRequest, IVerifyOTPRequest } from "interface/login";
import { useMutation } from "react-query";
import { useUserActions } from "../../redux/user";
import { QueryKeys } from "../../api/QueryKeys";
import { useUtils } from "hooks/useUtils";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { getErrorMessage } from "utils/globals.functions";

export const useVerify = () => {
  const cacheKey = QueryKeys.VerifyOTP;
  const { setUserInfo } = useUserActions();
  const { showToast } = useUtils();
  const { toggleGlobalLoader } = useGlobalLoaderActions();

  const verifyOTPRequest = useMutation(cacheKey, verifyOtp, {
    onSuccess: ({ data }, { onVerifyOTP }) => {
      setUserInfo(data);
      onVerifyOTP();
      toggleGlobalLoader({ visible: false });
    },
    onError: (e, { onVerifyOTPError }) => {
      // @ts-ignore
      showToast({ message: getErrorMessage(e?.message) });
      onVerifyOTPError();
      toggleGlobalLoader({ visible: false });
    },
  });

  const tryVerifyUser = (props: IVerifyOTPRequest) => {
    verifyOTPRequest.mutate(props);
  };

  return { ...verifyOTPRequest, tryVerifyUser };
};
