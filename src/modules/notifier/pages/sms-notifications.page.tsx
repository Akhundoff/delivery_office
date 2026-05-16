import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { SmsNotificationsTableContext } from '../context';
import { useSmsNotificationsTable } from '../hooks';
import { SmsNotificationsTable, SmsNotificationsActionBar } from '../containers';

export const SmsNotificationsPage: FC = () => {
    const { onFetch } = useSmsNotificationsTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={SmsNotificationsTableContext} onFetch={onFetch} name='sms-notifications-table'>
                <SmsNotificationsActionBar />
                <SmsNotificationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
