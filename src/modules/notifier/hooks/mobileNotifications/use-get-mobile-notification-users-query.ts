import { useQuery } from 'react-query';
import { ISendBulkMobileNotificationDto } from '../../interfaces';
import { BulkMobileNotificationService } from '../../services';

export const useGetMobileNotificationUsersQuery = (query: ISendBulkMobileNotificationDto) => {
    return useQuery(
        ['notifier', 'mobile', 'users', query],
        async () => {
            const result = await BulkMobileNotificationService.getUsers(query);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { enabled: !!query.type },
    );
};
