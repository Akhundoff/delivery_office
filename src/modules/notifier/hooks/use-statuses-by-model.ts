import { useQuery } from 'react-query';
import { StatusesByModelService } from '../services';

export const useStatusesByModel = (modelId: number | string, enabled = true) => {
    const query = useQuery(
        ['statuses', 'model', modelId],
        async () => {
            const result = await StatusesByModelService.getListByModelId(modelId);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { enabled },
    );
    return {
        statuses: query.data ?? [],
        isLoading: query.isLoading,
    };
};
