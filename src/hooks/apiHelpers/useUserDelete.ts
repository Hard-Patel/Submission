import { deleteUserRequest } from "../../api/api";
import { useMutation } from "react-query";
import {
  IDeleteUserRequest,
} from "interface/user";
import { useUtils } from "hooks/useUtils";
import { QueryKeys } from "../../api/QueryKeys";
import useLogoutHandler from "./useLogoutHandler";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { getErrorMessage } from "utils/globals.functions";

export const useUserDeleteQuery = () => {
  const cacheKey = QueryKeys.DeleteUser;
  const { hardRefetchQueries, showToast } = useUtils();
  const {clearAllData} = useLogoutHandler()
  const {toggleGlobalLoader} = useGlobalLoaderActions()

  const triggerDeleteUserReuqest = useMutation(cacheKey, deleteUserRequest, {
    onSuccess: (_, { isUserSelfDelete, onDeleteuserRequestSuccess }) => {
      toggleGlobalLoader({visible: false})
      hardRefetchQueries([`${QueryKeys.UserList}`]);
      onDeleteuserRequestSuccess?.();
      showToast({ message: "User deleted successfully" });
      if (isUserSelfDelete) {
        clearAllData();
      }
      toggleGlobalLoader({visible: false})
    },
    onError: (e, { onDeleteuserRequestError }) => {
      // @ts-ignore
      showToast({ message: getErrorMessage(e?.message) });
      onDeleteuserRequestError?.();
      toggleGlobalLoader({visible: false})
    },
  });

  const tryDeleteUser = (props: IDeleteUserRequest) => {
    toggleGlobalLoader({visible: true});
    triggerDeleteUserReuqest.mutate(props);
  };

  return { ...triggerDeleteUserReuqest, tryDeleteUser };
};
