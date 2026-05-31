import { useQuery } from 'react-query';
import { IDetailedOrder } from '../../interfaces';
import { OrdersService } from '../../services';

export const useOrderById = (id: string) => {
  return useQuery<IDetailedOrder, Error>(
    ['orders', String(id)],
    async () => {
      const result = await OrdersService.getById(id);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );
};
