import { useQuery } from 'react-query';
import { CouriersService } from '../../services';

export const useDelivererReasons = () => {
  const query = useQuery(['courier-deliverer-reasons'], CouriersService.getDelivererReasons, { staleTime: 5 * 60 * 1000 });
  return query.data?.status === 200 ? query.data.data : [];
};
