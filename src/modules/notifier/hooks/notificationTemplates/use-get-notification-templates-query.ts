import { useQuery } from 'react-query';
import { NotificationTemplatesService } from '../../services';

export const useGetNotificationTemplatesQuery = (query?: Record<string, any>) => {
    return useQuery(
        ['notifier', 'templates', query],
        async () => {
            const result = await NotificationTemplatesService.getList(query);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
    );
};
