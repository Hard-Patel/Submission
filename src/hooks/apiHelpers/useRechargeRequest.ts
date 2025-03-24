import { deviceRechargeRequest } from "../../api/api";
import { useMutation } from "react-query";
import { IAssignUserRequest, IDeviceRechargeRequest } from "interface/user";
import { useUtils } from "hooks/useUtils";
import { QueryKeys } from "../../api/QueryKeys";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { getErrorMessage } from "utils/globals.functions";

export const useDeviceRechargeRequestQuery = () => {
  const cacheKey = QueryKeys.RchargeRequest;
  const { hardRefetchQueries, showToast } = useUtils();
  const {toggleGlobalLoader} = useGlobalLoaderActions();

  const rechargeDeviceReuqest = useMutation(cacheKey, deviceRechargeRequest, {
    onSuccess: (_, { onRechargeRequestSuccess, device_id }) => {
      hardRefetchQueries([`${QueryKeys.DeviceDetails} ${device_id}`]);
      onRechargeRequestSuccess?.();
      toggleGlobalLoader({visible: false})
      showToast({ message: "Device recharge requested successfully" });
    },
    onError: (e, { onRechargeRequestError }) => {
      // @ts-ignore
      showToast({ message: getErrorMessage(e?.message) });
      onRechargeRequestError?.();
      toggleGlobalLoader({visible: false})
    },
  });

  const tryRechargeRequest = (props: IDeviceRechargeRequest) => {
    rechargeDeviceReuqest.mutate(props);
  };

  return { ...rechargeDeviceReuqest, tryRechargeRequest };
};
