import { useQuery } from 'react-query';
import { UsersService } from '../../services';

export const useLimitedUsers = (enabled = true) => {
  return useQuery(['users', 'limited'], () => UsersService.getLimitedUsers().then((r) => (r.status === 200 ? r.data.data : [])), { enabled });
};
