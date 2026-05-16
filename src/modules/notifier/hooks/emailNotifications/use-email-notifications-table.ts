import { useEmailNotificationsTableColumns } from './use-email-notifications-table-columns';

export const useEmailNotificationsTable = () => {
    const columns = useEmailNotificationsTableColumns();
    return { columns };
};
