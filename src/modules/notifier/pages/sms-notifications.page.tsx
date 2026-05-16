import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { SmsNotificationsTableContext } from '../context';
import { smsNotificationsTableFetchUseCase } from '../use-cases/sms-notifications-table-fetch';
import { SmsNotificationsTable, SmsNotificationsActionBar } from '../containers';

export const SmsNotificationsPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={SmsNotificationsTableContext} onFetch={smsNotificationsTableFetchUseCase} name='sms-notifications-table'>
                <SmsNotificationsActionBar />
                <SmsNotificationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
