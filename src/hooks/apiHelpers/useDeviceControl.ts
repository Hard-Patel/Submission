import { controlDevice } from "../../api/api";
import { useMutation, useQueryClient } from "react-query";
import { useUtils } from "hooks/useUtils";
import { QueryKeys } from "../../api/QueryKeys";
import {
  IDeviceControlRequest,
  IDeviceControlTabDetailResponse,
  IDeviceControlTabLIstResponse,
} from "interface/device";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { IDeviceSubItemNames } from "screens/DeviceControl/DeviceControlSubItems";
import { SOCKET_UPDATE_TIMEOUT } from "../../constants";
import { getErrorMessage } from "utils/globals.functions";

export const useDeviceControl = () => {
  const cacheKey = QueryKeys.DeviceControl;
  const queryClient = useQueryClient();
  const { toggleGlobalLoader } = useGlobalLoaderActions();
  const { showToast } = useUtils();

  const deviceControlReq = useMutation(cacheKey, controlDevice, {
    onSuccess: (_, { type, device_id, fencing_power, onDeviceControlSuccess }) => {
      onDeviceControlSuccess?.();
      if (type == IDeviceSubItemNames.CONFIGURATIONS) {
        showToast({ message: "Device updated successfully" });
      }
    },
    onError: (e, { onDeviceControlError }) => {
      // @ts-ignore
      showToast({ message: getErrorMessage(e?.message) });
      onDeviceControlError?.();
    },
    onSettled: () => {
      toggleGlobalLoader({ visible: false });
    },
  });

  const tryDeviceControl = (props: IDeviceControlRequest) => {
    const cacheKey = `${QueryKeys.DeviceDetails} ${props.device_id}`;
    const listCacheKey = `${QueryKeys.DeviceList} 1`;
    // const oldData = queryClient.getQueryData(cacheKey);
    // const oldListData = queryClient.getQueryData(listCacheKey);
    const handleError = () => {
      // queryClient.setQueryData(cacheKey, oldData);
      // queryClient.setQueryData(listCacheKey, oldListData);
    };
    deviceControlReq.mutate({ ...props, onDeviceControlError: handleError });
    const {
      device_id,
      onDeviceControlError,
      onDeviceControlSuccess,
      type,
      ...updater
    } = props;
    const loadingState =
      type == IDeviceSubItemNames.FENCING_POWER
        ? { fencing_power_loading: true }
        : type == IDeviceSubItemNames.AUTO_CONTROL
        ? { auto_control_loading: true }
        : type == IDeviceSubItemNames.SIREN
        ? { siren_loading: true }
        : {};

    const removeLoadingState = () => {
      const loadingEndState =
        type == IDeviceSubItemNames.FENCING_POWER
          ? { fencing_power_loading: false }
          : type == IDeviceSubItemNames.AUTO_CONTROL
          ? { auto_control_loading: false }
          : type == IDeviceSubItemNames.SIREN
          ? { siren_loading: false }
          : {};
      queryClient.setQueryData(
        cacheKey,
        (data: IDeviceControlTabDetailResponse) => {
          if (data?.data?.userDetail) {
            const updatedData = {
              ...data,
              data: {
                ...data?.data,
                userDetail: {
                  ...data?.data?.userDetail,
                  ...loadingEndState,
                },
              },
            };
            return updatedData;
          }
          return data;
        }
      );
    };

    queryClient.setQueryData(
      cacheKey,
      (data: IDeviceControlTabDetailResponse) => {
        if (data?.data?.userDetail) {
          const updatedData = {
            ...data,
            data: {
              ...data?.data,
              userDetail: {
                ...data?.data?.userDetail,
                // ...updater,
                ...loadingState,
              },
            },
          };
          return updatedData;
        }
        return data;
      }
    );

    if (updater?.fencing_power != undefined) {
      queryClient.setQueryData(
        `${QueryKeys.DeviceList} 1`,
        (oldData: IDeviceControlTabLIstResponse) => {
          return {
            ...oldData,
            data: {
              data: [
                ...oldData.data.data.map((item) => {
                  if (item.id == device_id) {
                    return {
                      ...item,
                      // fencing_power: updater?.fencing_power,
                      fencing_power_loading: true,
                    };
                  }
                  return item;
                }),
              ],
            },
          };
        }
      );
      const handleLoadingError = () => {
        queryClient.setQueryData(
          `${QueryKeys.DeviceList} 1`,
          (oldData: IDeviceControlTabLIstResponse) => {
            return {
              ...oldData,
              data: {
                data: [
                  ...oldData.data.data.map((item) => {
                    if (item.id == device_id) {
                      return {
                        ...item,
                        fencing_power_loading: false,
                      };
                    }
                    return item;
                  }),
                ],
              },
            };
          }
        );
      };
      setTimeout(() => {
        handleLoadingError();
      }, SOCKET_UPDATE_TIMEOUT);
    }
    const tm = setTimeout(() => {
      removeLoadingState();
      clearTimeout(tm);
    }, SOCKET_UPDATE_TIMEOUT);
  };

  return { ...deviceControlReq, tryDeviceControl };
};
