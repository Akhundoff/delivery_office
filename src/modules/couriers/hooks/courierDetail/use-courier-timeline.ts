import { useQuery } from 'react-query';
import { CouriersService } from '../../services';

export const useCourierTimeline = (id: string) => {
  const query = useQuery(['courier', id, 'execution'], () => CouriersService.getStatusExecution(id), { enabled: !!id });
  return { data: query.data?.status === 200 ? query.data.data : [], isLoading: query.isLoading };
};
