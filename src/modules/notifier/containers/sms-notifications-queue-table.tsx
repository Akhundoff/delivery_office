import { NextTable } from '@shared/modules/next-table/containers';
import { SmsNotificationsQueueTableContext } from '../context';
import { useSmsNotificationsQueueTableColumns } from '../hooks';

export const SmsNotificationsQueueTable = () => {
    const columns = useSmsNotificationsQueueTableColumns();
    return <NextTable context={SmsNotificationsQueueTableContext} columns={columns} />;
};
