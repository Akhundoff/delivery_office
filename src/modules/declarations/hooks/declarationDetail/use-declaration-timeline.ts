import { useQuery } from 'react-query';
import { DeclarationsService } from '../../services';
import { IStatusMapItem } from '../../interfaces';

export const useDeclarationTimeline = (id: string) => {
  return useQuery<IStatusMapItem[], Error>(
    ['declarations', id, 'status-map'],
    async () => {
      const result = await DeclarationsService.getStatusMap(id);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );
};
