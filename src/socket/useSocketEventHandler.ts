/**
 * @format
 */
import { useUtils } from "hooks/useUtils";
import { QueryKeys } from "../api/QueryKeys";
import {
  IDeviceControlTabDetailResponse,
  IDeviceControlTabItem,
  IDeviceControlTabLIstResponse,
} from "interface/device";
import {
  I_SOCKET_EVENTS,
  ISocketLivePayload,
  ISocketPayload,
} from "interface/socket";
import { useQueryClient } from "react-query";

const useSocketEventHandler = () => {
  const queryClient = useQueryClient();
  const { hardRefetchQueries } = useUtils();

  const handleLiveEvent = (
    ev: I_SOCKET_EVENTS,
    payload: ISocketLivePayload
  ) => {
    // hardRefetchQueries([`${QueryKeys.DeviceList} 1`])
    // hardRefetchQueries([`${QueryKeys.DeviceDetails} ${payload.id}`])
    const deviceDetailsKey = `${QueryKeys.DeviceDetails} ${payload.id}`;
    const deviceListKey = `${QueryKeys.DeviceList} 1`;
    queryClient.setQueryData(
      deviceListKey,
      (oldData: IDeviceControlTabLIstResponse) => {
        if (oldData) {
          return {
            ...oldData,
            data: {
              data: [
                ...oldData?.data?.data?.map((device: IDeviceControlTabItem) => {
                  if (device.id == payload?.id) {
                    const updateDevice: IDeviceControlTabItem = {
                      ...device,
                      is_online: payload?.status ?? 0,
                    };
                    return updateDevice;
                  }
                  return device;
                }),
              ],
            },
          };
        }
        return oldData;
      }
    );

    queryClient.setQueryData(
      deviceDetailsKey,
      (oldData: IDeviceControlTabDetailResponse) => {
        const userDetailsUpdated: IDeviceControlTabItem = {
          ...oldData?.data?.userDetail,
          is_online: payload?.status ?? 0,
        };

        const updatedData = {
          ...oldData,
          data: {
            userDetail: { ...userDetailsUpdated },
          },
        };
        console.log("oldData: ", oldData);
        console.log("updatedData: ", updatedData);
        return updatedData;
      }
    );
  };

  const handleEvent = (ev: I_SOCKET_EVENTS, payload: ISocketPayload) => {
    console.log("payload: ", payload);
    const deviceDetailsKey = `${QueryKeys.DeviceDetails} ${payload.id}`;
    const deviceListKey = `${QueryKeys.DeviceList} 1`;
    queryClient.setQueryData(
      deviceListKey,
      (oldData: IDeviceControlTabLIstResponse) => {
        if (oldData) {
          return {
            ...oldData,
            data: {
              data: [
                ...oldData?.data?.data?.map((device) => {
                  if (device.sn == payload?.device_id) {
                    const updateDevice = {
                      ...device,
                      fence_sensitivity:
                        payload?.conf?.fence_sens ?? device?.fence_sensitivity,
                      fencing_power:
                        payload?.data?.fence_power ?? device?.fencing_power,
                      voltage: payload?.conf?.fenceVolt ?? device?.voltage,
                      pulse_speed:
                        payload?.conf?.pulse_speed ?? device?.pulse_speed,
                      battery_voltage:
                        payload?.data?.bVolt ?? device?.battery_voltage,
                      charge_status:
                        payload?.data?.chgState ?? device?.charge_status,
                      fence_status:
                        payload?.data?.fenceState ?? device?.fence_status,
                      auto_control:
                        payload?.data?.auto_control ?? device?.auto_control,
                      siren: payload?.data?.siren ?? device?.siren,
                      siren_loading: false,
                      auto_control_loading: false,
                      fencing_power_loading: false,
                    };
                    return updateDevice;
                  }
                  return device;
                }),
              ],
            },
          };
        }
        return oldData;
      }
    );

    queryClient.setQueryData(
      deviceDetailsKey,
      (oldData: IDeviceControlTabDetailResponse) => {
        const userDetailsUpdated: IDeviceControlTabItem = {
          ...oldData?.data?.userDetail,
          fence_sensitivity:
            payload?.conf?.fence_sens ??
            oldData?.data?.userDetail?.fence_sensitivity,
          fencing_power:
            payload?.data?.fence_power ??
            oldData?.data?.userDetail?.fencing_power,
          voltage:
            payload?.conf?.fenceVolt ?? oldData?.data?.userDetail?.voltage,
          pulse_speed:
            payload?.conf?.pulse_speed ??
            oldData?.data?.userDetail?.pulse_speed,
          battery_voltage:
            payload?.data?.bVolt ??
            oldData?.data?.userDetail?.battery_voltage,
          charge_status:
            payload?.data?.chgState ?? oldData?.data?.userDetail?.charge_status,
          fence_status:
            payload?.data?.fenceState ??
            oldData?.data?.userDetail?.fence_status,
          auto_control:
            payload?.data?.auto_control ??
            oldData?.data?.userDetail?.auto_control,
          siren: payload?.data?.siren ?? oldData?.data?.userDetail?.siren,
          siren_loading: false,
          auto_control_loading: false,
          fencing_power_loading: false,
        };

        const updatedData = {
          ...oldData,
          data: {
            userDetail: { ...userDetailsUpdated },
          },
        };
        console.log("oldData: ", oldData);
        console.log("updatedData: ", updatedData);
        return updatedData;
      }
    );
  };

  return {
    handleEvent,
    handleLiveEvent,
  };
};

export { useSocketEventHandler };
