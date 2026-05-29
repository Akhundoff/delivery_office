import { useQuery } from 'react-query';
import { SortingService } from '../../services';

export const useSelectFlights = () =>
  useQuery(
    ['sorting-select-flights'],
    async () => {
      const result = await SortingService.getSelectFlights();
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );
