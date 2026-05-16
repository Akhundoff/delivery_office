import { useNotificationTemplatesTableColumns } from './use-notification-templates-table-columns';

export const useNotificationTemplatesTable = () => {
    const columns = useNotificationTemplatesTableColumns();
    return { columns };
};
