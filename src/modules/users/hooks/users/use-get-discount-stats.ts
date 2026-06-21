import { useQuery } from 'react-query';
import { UsersService } from '../../services';

export const useGetDiscountStats = (userId: string | number) => {
  return useQuery(['users', 'discount-stats', userId], () => UsersService.getDiscountStats(userId).then((r) => (r.status === 200 ? r.data : [])), { enabled: !!userId });
};
