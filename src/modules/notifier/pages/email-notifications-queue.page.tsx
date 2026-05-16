import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { EmailNotificationsQueueTableContext } from '../context';
import { emailNotificationsQueueTableFetchUseCase } from '../use-cases/email-notifications-queue-table-fetch';
import { EmailNotificationsQueueTable, EmailNotificationsQueueActionBar } from '../containers';

export const EmailNotificationsQueuePage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={EmailNotificationsQueueTableContext} onFetch={emailNotificationsQueueTableFetchUseCase} name='email-notifications-queue-table'>
                <EmailNotificationsQueueActionBar />
                <EmailNotificationsQueueTable />
            </NextTableProvider>
        </PageContent>
    );
};
