import { useWhatsappNotificationsTableColumns } from './use-whatsapp-notifications-table-columns';

export const useWhatsappNotificationsTable = () => {
    const columns = useWhatsappNotificationsTableColumns();
    return { columns };
};
