import { NextTable } from '@shared/modules/next-table/containers';
import { EmailNotificationsQueueTableContext } from '../context';
import { useEmailNotificationsQueueTableColumns } from '../hooks';

export const EmailNotificationsQueueTable = () => {
    const columns = useEmailNotificationsQueueTableColumns();
    return <NextTable context={EmailNotificationsQueueTableContext} columns={columns} />;
};
