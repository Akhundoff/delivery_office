import { useSmsNotificationsTableColumns } from './use-sms-notifications-table-columns';

export const useSmsNotificationsTable = () => {
    const columns = useSmsNotificationsTableColumns();
    return { columns };
};
