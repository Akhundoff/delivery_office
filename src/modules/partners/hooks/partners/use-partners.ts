import { useQuery } from 'react-query';
import { PartnersService } from '../../services';
import { IPartner } from '../../interfaces';

export const usePartners = () => {
  return useQuery<IPartner[], Error>(
    ['partners'],
    async () => {
      const result = await PartnersService.getPartners();
      if (result.status === 200) return result.data;
      throw new Error(result.data);
    },
    { staleTime: 15 * 60 * 1000, initialData: [] },
  );
};
