import { useContext } from 'react';
import { NotificationTemplatesTableContext } from '../../context';
import { useNotificationTemplatesTableColumns } from './use-notification-templates-table-columns';

export const useNotificationTemplatesTable = () => {
    const { handleFetch } = useContext(NotificationTemplatesTableContext);
    const columns = useNotificationTemplatesTableColumns(handleFetch);
    return { columns };
};
