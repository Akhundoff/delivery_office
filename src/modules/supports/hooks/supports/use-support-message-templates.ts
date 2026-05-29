import { useQuery } from 'react-query';
import { SupportsService } from '../../services';

export const useSupportMessageTemplates = () =>
  useQuery(
    ['supports', 'message-templates'],
    async () => {
      const result = await SupportsService.getMessageTemplates();
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );
