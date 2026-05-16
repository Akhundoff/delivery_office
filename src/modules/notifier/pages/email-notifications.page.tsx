import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { EmailNotificationsTableContext } from '../context';
import { emailNotificationsTableFetchUseCase } from '../use-cases/email-notifications-table-fetch';
import { EmailNotificationsTable, EmailNotificationsActionBar } from '../containers';

export const EmailNotificationsPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={EmailNotificationsTableContext} onFetch={emailNotificationsTableFetchUseCase} name='email-notifications-table'>
                <EmailNotificationsActionBar />
                <EmailNotificationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
