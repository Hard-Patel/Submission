import { QueryKeys } from "../../api/QueryKeys";
import { deviceList } from "../../api/api";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";

export const useDeviceListQuery = ({
  isActive,
  search = "",
  isForDeviceControlTab = false
}: {
  isActive: number;
  search?: string;
  isForDeviceControlTab?: boolean;
}) => {
  const cacheKey = `${QueryKeys.DeviceList} ${isActive}`;

  const { user } = useSelector((state: RootState) => state.user);

  const deviceRequest = useQuery(
    cacheKey,
    () =>
      deviceList({
        user_id: user.profile.user_id,
        isForDeviceControlTab,
        isActive,
        count: 10,
        limit: 10,
        offset: 1,
        filter: { search },
      }),
    {
      notifyOnChangeProps: "tracked",
    }
  );

  return { ...deviceRequest };
};
