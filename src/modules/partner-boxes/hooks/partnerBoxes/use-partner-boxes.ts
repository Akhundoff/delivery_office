import { useQuery } from 'react-query';
import { PartnerBoxesService } from '../../services';

export const usePartnerBoxes = () => {
  return useQuery(['partner-boxes-all'], async () => {
    const result = await PartnerBoxesService.getAll();
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  });
};
