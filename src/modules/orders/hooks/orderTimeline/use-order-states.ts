import { useQuery } from 'react-query';
import { IOrderStateExecution } from '../../interfaces';
import { OrdersService } from '../../services';

export const useOrderStates = (id: string) => {
  return useQuery<IOrderStateExecution[], Error>(
    ['orders', String(id), 'states'],
    async () => {
      const result = await OrdersService.getStates(id);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );
};
