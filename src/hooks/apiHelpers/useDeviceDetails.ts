import { QueryKeys } from '../../api/QueryKeys';
import {deviceDetails} from '../../api/api';
import {useQuery} from 'react-query';

export const useDeviceDetailsQuery = ({device_id, shouldNotRefetch = false}: {device_id: string, shouldNotRefetch?: boolean}) => {
  const cacheKey = `${QueryKeys.DeviceDetails} ${device_id}`;

  const deviceRequest = useQuery(cacheKey, () =>
    deviceDetails({
      device_id: device_id,
    }),
    {
      cacheTime: 0,
      staleTime: 5000,
    }
  );

  return {...deviceRequest};
};
