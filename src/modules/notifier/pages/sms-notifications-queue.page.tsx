import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { SmsNotificationsQueueTableContext } from '../context';
import { smsNotificationsQueueTableFetchUseCase } from '../use-cases/sms-notifications-queue-table-fetch';
import { SmsNotificationsQueueTable, SmsNotificationsQueueActionBar } from '../containers';

export const SmsNotificationsQueuePage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={SmsNotificationsQueueTableContext} onFetch={smsNotificationsQueueTableFetchUseCase} name='sms-notifications-queue-table'>
                <SmsNotificationsQueueActionBar />
                <SmsNotificationsQueueTable />
            </NextTableProvider>
        </PageContent>
    );
};
