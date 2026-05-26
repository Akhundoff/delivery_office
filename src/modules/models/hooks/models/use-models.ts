import { useQuery } from 'react-query';
import { ModelsService } from '../../services';
import { IModel } from '../../interfaces';

export const useModels = () => {
    return useQuery<IModel[], Error>(
        ['models-list'],
        async () => {
            const result = await ModelsService.getList({ per_page: 200 });
            if (result.status === 200) return result.data.data;
            throw new Error(result.data as string);
        },
        { staleTime: 10 * 60 * 1000 },
    );
};
