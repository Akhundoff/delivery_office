import { ISendBulkSmsNotificationDto } from '../../interfaces';
import { useStatusesByModel } from '../use-statuses-by-model';
import { useGetSmsBalanceQuery } from './use-get-sms-balance-query';
import { useGetSmsNotificationUsersQuery } from './use-get-sms-notification-users-query';

export const useSendBulkSmsNotification = (values: ISendBulkSmsNotificationDto) => {
    const orderStatus = useStatusesByModel(1, values.type === 'orderStatus');
    const declarationStatus = useStatusesByModel(2, values.type === 'declarationStatus');
    const courierStatus = useStatusesByModel(3, values.type === 'courierStatus');

    const balanceQuery = useGetSmsBalanceQuery();
    const usersQuery = useGetSmsNotificationUsersQuery(values);

    return {
        orderStatuses: orderStatus.statuses,
        orderStatusesLoading: orderStatus.isLoading,
        declarationStatuses: declarationStatus.statuses,
        declarationStatusesLoading: declarationStatus.isLoading,
        courierStatuses: courierStatus.statuses,
        courierStatusesLoading: courierStatus.isLoading,
        smsBalance: balanceQuery.data,
        users: usersQuery.data ?? null,
        usersLoading: usersQuery.isLoading,
    };
};
