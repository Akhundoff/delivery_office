import { useQuery } from 'react-query';
import { ISendBulkSmsNotificationDto } from '../../interfaces';
import { BulkSmsNotificationService } from '../../services';

export const useGetSmsNotificationUsersQuery = (query: ISendBulkSmsNotificationDto) => {
    return useQuery(
        ['notifier', 'sms', 'users', query],
        async () => {
            const result = await BulkSmsNotificationService.getUsers(query);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { enabled: !!query.type },
    );
};
