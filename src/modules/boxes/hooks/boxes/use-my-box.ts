import { useQuery } from 'react-query';
import { BoxesService } from '../../services';
import { IBox } from '../../interfaces';

export const useMyBox = () => {
  return useQuery<IBox | null>(['my-box'], async () => {
    const result = await BoxesService.getMyBox();
    return result.status === 200 ? result.data : null;
  });
};
