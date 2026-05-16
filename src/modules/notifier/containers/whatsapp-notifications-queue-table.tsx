import { NextTable } from '@shared/modules/next-table/containers';
import { WhatsappNotificationsQueueTableContext } from '../context';
import { useWhatsappNotificationsQueueTableColumns } from '../hooks';

export const WhatsappNotificationsQueueTable = () => {
    const columns = useWhatsappNotificationsQueueTableColumns();
    return <NextTable context={WhatsappNotificationsQueueTableContext} columns={columns} />;
};
