import { ISendBulkEmailNotificationDto } from '../../interfaces';
import { useStatusesByModel } from '../use-statuses-by-model';
import { useGetNotificationTemplatesQuery } from '../notificationTemplates/use-get-notification-templates-query';
import { useGetEmailNotificationUsersQuery } from './use-get-email-notification-users-query';

export const useSendBulkEmailNotification = (values: ISendBulkEmailNotificationDto) => {
    const templatesQuery = useGetNotificationTemplatesQuery({ template_type_id: 2, per_page: 200 });

    const orderStatus = useStatusesByModel(1, values.type === 'orderStatus');
    const declarationStatus = useStatusesByModel(2, values.type === 'declarationStatus');
    const courierStatus = useStatusesByModel(3, values.type === 'courierStatus');

    const usersQuery = useGetEmailNotificationUsersQuery(values);

    return {
        templates: templatesQuery.data?.data ?? [],
        templatesLoading: templatesQuery.isLoading,
        orderStatuses: orderStatus.statuses,
        orderStatusesLoading: orderStatus.isLoading,
        declarationStatuses: declarationStatus.statuses,
        declarationStatusesLoading: declarationStatus.isLoading,
        courierStatuses: courierStatus.statuses,
        courierStatusesLoading: courierStatus.isLoading,
        users: usersQuery.data ?? null,
        usersLoading: usersQuery.isLoading,
    };
};
