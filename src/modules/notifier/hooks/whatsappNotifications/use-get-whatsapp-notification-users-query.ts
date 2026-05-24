import { useQuery } from 'react-query';
import { ISendBulkWhatsappNotificationDto } from '../../interfaces';
import { BulkWhatsappNotificationService } from '../../services';

export const useGetWhatsappNotificationUsersQuery = (query: ISendBulkWhatsappNotificationDto) => {
    return useQuery(
        ['notifier', 'whatsapp', 'users', query],
        async () => {
            const result = await BulkWhatsappNotificationService.getUsers(query);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { enabled: !!query.type },
    );
};
