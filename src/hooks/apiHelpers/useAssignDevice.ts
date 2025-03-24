import { assignDevice } from "../../api/api";
import { useMutation } from "react-query";
import { useUtils } from "hooks/useUtils";
import { QueryKeys } from "../../api/QueryKeys";
import { IAssignDeviceRequest } from "../../interface/device";
import { useGlobalLoaderActions } from "../../redux/globalLoader";

export const useAssignDevicesQuery = () => {
  const cacheKey = QueryKeys.AssignDevice;
  const { showToast } = useUtils();
  const { toggleGlobalLoader } = useGlobalLoaderActions();

  const assignDevices = useMutation(cacheKey, assignDevice, {
    onSuccess: (_, { onAssignDeviceSuccess }) => {
      showToast({ message: "Updated successfully" });
      onAssignDeviceSuccess();
      toggleGlobalLoader({ visible: false });
    },
    onError: (_, { onAssignDeviceError }) => {
      toggleGlobalLoader({ visible: false });
      onAssignDeviceError();
    },
  });

  const tryAssignDevices = (props: IAssignDeviceRequest) => {
    assignDevices.mutate(props);
  };

  return { ...assignDevices, tryAssignDevices };
};
