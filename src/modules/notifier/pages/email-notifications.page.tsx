import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { EmailNotificationsTableContext } from '../context';
import { useEmailNotificationsTable } from '../hooks';
import { EmailNotificationsTable, EmailNotificationsActionBar } from '../containers';

export const EmailNotificationsPage: FC = () => {
    const { onFetch } = useEmailNotificationsTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={EmailNotificationsTableContext} onFetch={onFetch} name='email-notifications-table'>
                <EmailNotificationsActionBar />
                <EmailNotificationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
