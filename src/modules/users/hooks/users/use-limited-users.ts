import { useQuery } from 'react-query';
import { UsersService } from '../../services';

export const useLimitedUsers = (enabled = true) => {
  return useQuery(['users', 'limited'], () => UsersService.getUsers({ per_page: 500 }).then((r) => (r.status === 200 ? r.data.data : [])), { enabled });
};
