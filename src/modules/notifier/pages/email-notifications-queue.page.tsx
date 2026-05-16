import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { EmailNotificationsQueueTableContext } from '../context';
import { useEmailNotificationsQueueTable } from '../hooks';
import { EmailNotificationsQueueTable, EmailNotificationsQueueActionBar } from '../containers';

export const EmailNotificationsQueuePage: FC = () => {
    const { onFetch } = useEmailNotificationsQueueTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={EmailNotificationsQueueTableContext} onFetch={onFetch} name='email-notifications-queue-table'>
                <EmailNotificationsQueueActionBar />
                <EmailNotificationsQueueTable />
            </NextTableProvider>
        </PageContent>
    );
};
