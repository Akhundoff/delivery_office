import { useQuery } from 'react-query';
import { StatusesService } from '../../services';
import { IStatus } from '../../interfaces';

export const useStatuses = (params?: Record<string, any>) => {
    return useQuery<IStatus[], Error>(
        ['statuses-list', params],
        async () => {
            const result = await StatusesService.getList({ per_page: 500, ...params });
            if (result.status === 200) return result.data.data;
            throw new Error(result.data as string);
        },
        { staleTime: 5 * 60 * 1000 },
    );
};
