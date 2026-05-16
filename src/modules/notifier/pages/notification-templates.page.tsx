import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { NotificationTemplatesTableContext } from '../context';
import { notificationTemplatesTableFetchUseCase } from '../use-cases/notification-templates-table-fetch';
import { NotificationTemplatesTable, NotificationTemplatesActionBar } from '../containers';

export const NotificationTemplatesPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={NotificationTemplatesTableContext} onFetch={notificationTemplatesTableFetchUseCase} name='notification-templates-table'>
                <NotificationTemplatesActionBar />
                <NotificationTemplatesTable />
            </NextTableProvider>
        </PageContent>
    );
};
