import { useQuery } from 'react-query';
import { SupportsService } from '../../services';

export const useSupportSelectUsers = () =>
  useQuery(
    ['supports', 'select-users'],
    async () => {
      const result = await SupportsService.getSelectUsers();
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );
