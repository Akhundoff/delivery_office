import { ISendBulkMobileNotificationDto } from '../../interfaces';
import { useGetNotificationTemplatesQuery } from '../notificationTemplates/use-get-notification-templates-query';
import { useGetMobileNotificationUsersQuery } from './use-get-mobile-notification-users-query';

export const useSendBulkMobileNotification = (values: ISendBulkMobileNotificationDto) => {
    const templatesQuery = useGetNotificationTemplatesQuery({ template_type_id: 3, per_page: 200 });
    const usersQuery = useGetMobileNotificationUsersQuery(values);

    return {
        templates: templatesQuery.data?.data ?? [],
        templatesLoading: templatesQuery.isLoading,
        users: usersQuery.data ?? null,
        usersLoading: usersQuery.isLoading,
    };
};
