import {deviceDetailsUpdate, userDetailsUpdate} from '../../api/api';
import {IEditDeviceRequest, IEditUserRequest} from 'interface/login';
import {useMutation, useQueryClient} from 'react-query';
import {QueryKeys} from '../../api/QueryKeys';
import {useUtils} from 'hooks/useUtils';
import { useGlobalLoaderActions } from '../../redux/globalLoader';
import { getErrorMessage } from 'utils/globals.functions';

export const useUserDetailsUpdate = () => {
  const cacheKey = QueryKeys.DeviceDetailsUpdate;
  const {showToast, hardRefetchQueries} = useUtils();
  const queryClient = useQueryClient();
  const {toggleGlobalLoader} = useGlobalLoaderActions();

  const userDetailsUpdateRequest = useMutation(cacheKey, userDetailsUpdate, {
    onSuccess: ({data}, {onEditUserSuccess, user_id}) => {
      onEditUserSuccess();
      showToast({message: 'Success'});
      hardRefetchQueries([`${QueryKeys.UserList}`]);
      toggleGlobalLoader({visible: false})
    },
    onError: (e, {onEditUserError}) => {
      onEditUserError();
      showToast({
        // @ts-ignore
        message: getErrorMessage(e?.message),
        type: 'warning',
      });
      toggleGlobalLoader({visible: false})
    },
  });

  const tryUpdateUserDetails = (props: IEditUserRequest) => {
    userDetailsUpdateRequest.mutate(props);
  };

  return {...userDetailsUpdateRequest, tryUpdateUserDetails};
};
