import { useQuery } from 'react-query';
import { ParcelsService } from '../../services';
import { IParcel } from '../../interfaces';

export const useParcels = (query: Record<string, any> = {}) => {
  return useQuery<IParcel[], Error>(
    ['parcels', query],
    async () => {
      const result = await ParcelsService.getParcels(query);
      if (result.status === 200) return result.data;
      throw new Error(result.data);
    },
    { staleTime: 5 * 60 * 1000, initialData: [] },
  );
};
