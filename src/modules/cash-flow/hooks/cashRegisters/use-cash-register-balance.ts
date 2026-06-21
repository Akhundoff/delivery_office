import { useQuery } from 'react-query';
import { CashRegistersService } from '../../services';
import { ICashRegister } from '../../interfaces';

export const useCashRegisterBalance = (options?: { enabled?: boolean }) => {
  return useQuery<ICashRegister>(
    ['cash-registers', 'current', 'balance'],
    async () => {
      const result = await CashRegistersService.getBalance();

      if (result.status === 200) {
        return result.data;
      }

      throw new Error(result.data as string);
    },
    { enabled: options?.enabled },
  );
};
