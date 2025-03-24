import {
  deviceRechargeRequest,
  notificationPreferenceUpdate,
} from "../../api/api";
import { useMutation, useQueryClient } from "react-query";
import {
  IAssignUserRequest,
  IDeviceRechargeRequest,
  INotificationPreferenceRequest,
} from "interface/user";
import { useUtils } from "hooks/useUtils";
import { QueryKeys } from "../../api/QueryKeys";
import { useUserActions } from "../../redux/user";
import { useGlobalLoaderActions } from "../../redux/globalLoader";

export const useNotificationPreferenceUpdateQuery = () => {
  const cacheKey = QueryKeys.NotificationPreference;
  const { showToast } = useUtils();
  const { updateUserProfileInfo } = useUserActions();
  const {toggleGlobalLoader} = useGlobalLoaderActions();

  const notificationPreferenceRequest = useMutation(
    cacheKey,
    notificationPreferenceUpdate,
    {
      onSuccess: (_, { onNotificationPrefRequestSuccess, onNotificationPrefRequestError, user_id, ...restUpdater }) => {
        updateUserProfileInfo(restUpdater);
        console.log('restUpdater: ', restUpdater);
        onNotificationPrefRequestSuccess?.();
        toggleGlobalLoader({visible: false})
        showToast({ message: "Notification preference updated successfully" });
      },
      onError: (e, { onNotificationPrefRequestError }) => {
        toggleGlobalLoader({visible: false})
        // @ts-ignore
        showToast({ message: getErrorMessage(e?.message) });
        onNotificationPrefRequestError?.();
      },
    }
  );

  const tryNotificationPreferenceUpdateRequest = (
    props: INotificationPreferenceRequest
  ) => {
    notificationPreferenceRequest.mutate(props);
  };

  return {
    ...notificationPreferenceRequest,
    tryNotificationPreferenceUpdateRequest,
  };
};
