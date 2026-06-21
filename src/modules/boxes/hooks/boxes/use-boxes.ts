import { useQuery, UseQueryOptions } from 'react-query';
import { BoxesService } from '../../services';
import { IBox } from '../../interfaces';

export const useBoxes = (query: Record<string, any> = {}, options?: UseQueryOptions<IBox[]>) => {
  return useQuery<IBox[]>(
    ['boxes', query],
    async () => {
      const result = await BoxesService.getList(query);
      return result.status === 200 ? result.data.data : [];
    },
    options,
  );
};
