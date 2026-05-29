import { useQuery } from 'react-query';
import { SupportsService } from '../../services';

export const useSupport = (id?: string) =>
  useQuery(
    ['supports', id || ''],
    async () => {
      const result = await SupportsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );
