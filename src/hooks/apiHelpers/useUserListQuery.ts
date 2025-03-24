import { QueryKeys } from '../../api/QueryKeys';
import {deviceList, tryLogin, userList} from '../../api/api';
import {ILoginData, ILoginRequest} from 'interface/login';
import {useMutation, useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';

export const useUserListQuery = ({search = ''}: {search: string}) => {
  const cacheKey = QueryKeys.UserList;

  const {user} = useSelector((state: RootState) => state.user);

  const deviceRequest = useQuery(cacheKey, () =>
    userList({
      user_id: user?.profile?.user_id ?? "",
      count: 10,
      limit: 10,
      offset: 1,
      filter: {search: search ?? ''},
    }),
  );

  return {...deviceRequest};
};
