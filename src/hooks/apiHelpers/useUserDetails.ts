import { QueryKeys } from "../../api/QueryKeys";
import { userDetails } from "../../api/api";
import { useMutation } from "react-query";

export const useUserDetailsQuery = ({ user_id }: { user_id: string }) => {
  const cacheKey = `${QueryKeys.UserDetail} ${user_id}`;

  const userDetailRequest = useMutation(cacheKey, userDetails);

  const triggerUserDetailsGet = (props: { user_id: string }) => {
    userDetailRequest.mutate(props);
  };

  return { ...userDetailRequest, triggerUserDetailsGet };
};
