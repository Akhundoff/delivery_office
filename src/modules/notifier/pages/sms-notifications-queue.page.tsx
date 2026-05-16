import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { SmsNotificationsQueueTableContext } from '../context';
import { useSmsNotificationsQueueTable } from '../hooks';
import { SmsNotificationsQueueTable, SmsNotificationsQueueActionBar } from '../containers';

export const SmsNotificationsQueuePage: FC = () => {
    const { onFetch } = useSmsNotificationsQueueTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={SmsNotificationsQueueTableContext} onFetch={onFetch} name='sms-notifications-queue-table'>
                <SmsNotificationsQueueActionBar />
                <SmsNotificationsQueueTable />
            </NextTableProvider>
        </PageContent>
    );
};
