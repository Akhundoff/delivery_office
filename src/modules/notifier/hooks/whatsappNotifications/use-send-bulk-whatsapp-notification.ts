import { ISendBulkWhatsappNotificationDto } from '../../interfaces';
import { useStatusesByModel } from '../use-statuses-by-model';
import { useGetNotificationTemplatesQuery } from '../notificationTemplates/use-get-notification-templates-query';
import { useGetWhatsappNotificationUsersQuery } from './use-get-whatsapp-notification-users-query';

export const useSendBulkWhatsappNotification = (values: ISendBulkWhatsappNotificationDto) => {
    const templatesQuery = useGetNotificationTemplatesQuery({ template_type_id: 4, per_page: 200 });

    const orderStatus = useStatusesByModel(1, values.type === 'orderStatus');
    const declarationStatus = useStatusesByModel(2, values.type === 'declarationStatus');
    const courierStatus = useStatusesByModel(3, values.type === 'courierStatus');

    const usersQuery = useGetWhatsappNotificationUsersQuery(values);

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
