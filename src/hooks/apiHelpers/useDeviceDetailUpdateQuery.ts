import { deviceDetailsUpdate } from "../../api/api";
import { IEditDeviceRequest } from "interface/login";
import { useMutation, useQueryClient } from "react-query";
import { QueryKeys } from "../../api/QueryKeys";
import { useUtils } from "hooks/useUtils";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { getErrorMessage } from "utils/globals.functions";

export const useDeviceDetailsUpdate = () => {
  const cacheKey = QueryKeys.DeviceDetailsUpdate;
  const { showToast, hardRefetchQueries } = useUtils();
  const queryClient = useQueryClient();
  const { toggleGlobalLoader } = useGlobalLoaderActions();

  const deviceDetailsUpdateRequest = useMutation(
    cacheKey,
    deviceDetailsUpdate,
    {
      onSuccess: (
        { data },
        { onEditDeviceSuccess, device_id, deviceDetail }
      ) => {
        onEditDeviceSuccess();
        toggleGlobalLoader({ visible: false });
        showToast({ message: "Device Information Updated" });
        hardRefetchQueries([`${QueryKeys.DeviceDetails} ${device_id}`]);
        hardRefetchQueries([`${QueryKeys.DeviceList} 1`]);
        hardRefetchQueries([`${QueryKeys.DeviceList} 2`]);

        const data1 = queryClient.getQueryData([`${QueryKeys.DeviceList}`]);
        console.log("data: ", data1);
      },
      onError: (e, { onEditDeviceError }) => {
        onEditDeviceError();
        toggleGlobalLoader({ visible: false });
        showToast({
          // @ts-ignore
          message: getErrorMessage(e?.message),
          type: "warning",
        });
      },
    }
  );

  const tryUpdateDeviceDetails = (props: IEditDeviceRequest) => {
    deviceDetailsUpdateRequest.mutate(props);
  };

  return { ...deviceDetailsUpdateRequest, tryUpdateDeviceDetails };
};
