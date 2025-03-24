import { assignUsers } from "../../api/api";
import { useMutation, useQueryClient } from "react-query";
import { IAssignUserRequest, IUserListResponse } from "interface/user";
import { useUtils } from "hooks/useUtils";
import { QueryKeys } from "../../api/QueryKeys";
import { useGlobalLoaderActions } from "../../redux/globalLoader";
import { IDeviceControlTabDetailResponse, IDeviceRel } from "interface/device";

export const useAssignUsersQuery = () => {
  const cacheKey = QueryKeys.AssignUser;
  const { hardRefetchQueries } = useUtils();
  const { toggleGlobalLoader } = useGlobalLoaderActions();
  const queryClient = useQueryClient();

  const assignUsersReuqest = useMutation(cacheKey, assignUsers, {
    onSuccess: (_, { onAssignUserSuccess, device_id, remove_users, users }) => {
      console.log("remove_users, users: ", remove_users, users);
      console.log("_: ", _);
      // hardRefetchQueries([`${QueryKeys.DeviceDetails} ${device_id}`])
      hardRefetchQueries([`${QueryKeys.DeviceList} 1`]);
      hardRefetchQueries([`${QueryKeys.DeviceList} 2`]);
      onAssignUserSuccess();
      toggleGlobalLoader({ visible: false });

      const cacheKey = `${QueryKeys.DeviceDetails} ${device_id}`;

      const allUsersList: IUserListResponse = queryClient.getQueryData(
        `${QueryKeys.UserList}`
      );

      queryClient.setQueryData(
        cacheKey,
        (oldQueryData: IDeviceControlTabDetailResponse) => {
          let usersList = oldQueryData.data.userDetail.DeviceRel;
          if (remove_users?.length) {
            usersList = usersList.filter((it) =>
              !remove_users.includes(it.user_id)
            );
          }
          if (users?.length) {
            const addedUsers = allUsersList.data.userList
              .filter(
                (it) =>
                  users?.includes(it.id) &&
                  !oldQueryData.data.userDetail.DeviceRel.map(
                    (it) => it.user_id
                  ).includes(it.id)
              )
              .map((user): IDeviceRel => {
                return {
                  User: user,
                  user_id: user.id,
                  createdAt: "",
                  Device: {},
                  device_id: device_id,
                  id: "",
                  is_owner: 0,
                  status: 0,
                  updatedAt: Date.now().toString(),
                };
              });
              usersList = usersList.concat(addedUsers);
          }

          return {
            ...oldQueryData,
            data: {
              userDetail: {
                ...oldQueryData.data.userDetail,
                DeviceRel: usersList,
              },
            },
          };
        }
      );
    },
    onError: (_, { onAssignUserError }) => {
      toggleGlobalLoader({ visible: false });
      onAssignUserError();
    },
  });

  const tryAssignUsers = (props: IAssignUserRequest) => {
    assignUsersReuqest.mutate(props);
  };

  return { ...assignUsersReuqest, tryAssignUsers };
};
