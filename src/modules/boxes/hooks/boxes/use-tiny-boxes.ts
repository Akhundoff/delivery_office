import { useQuery } from 'react-query';
import { BoxesService } from '../../services';
import { ITinyBox } from '../../interfaces';

export const useTinyBoxes = (query: Record<string, any> = {}) => {
  return useQuery<ITinyBox[]>(['tiny-boxes', query], async () => {
    const result = await BoxesService.getTinyBoxes(query);
    return result.status === 200 ? result.data : [];
  });
};
