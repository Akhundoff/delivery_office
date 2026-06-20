import { useQuery } from 'react-query';
import { FlightsService } from '../../services';

export const useTinyFlights = () => {
  return useQuery(['tiny-flights'], () => FlightsService.getTinyFlights().then((r) => (r.status === 200 ? r.data : [])), {
    staleTime: 5 * 60 * 1000,
  });
};
