import { useQuery } from 'react-query';
import { ModelsService } from '@modules/models/services';
import { NotificationTemplatesService } from '../../services';
import { useStatusesByModel } from '../use-statuses-by-model';

export const useCreateNotificationTemplate = (id?: string, modelId?: string) => {
    const templateQuery = useQuery(
        ['notifier', 'template', id],
        async () => {
            const result = await NotificationTemplatesService.getById(id!);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { enabled: !!id },
    );

    const modelsQuery = useQuery(
        ['models', 'list'],
        async () => {
            const result = await ModelsService.getList({ per_page: 200 });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
    );

    const { statuses, isLoading: statusesLoading } = useStatusesByModel(modelId ?? '', !!modelId);

    return {
        template: templateQuery.data ?? null,
        templateLoading: templateQuery.isLoading,
        models: modelsQuery.data?.data ?? [],
        modelsLoading: modelsQuery.isLoading,
        statuses,
        statusesLoading,
    };
};
