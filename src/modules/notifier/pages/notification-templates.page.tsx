import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { NotificationTemplatesTableContext } from '../context';
import { useNotificationTemplatesTable } from '../hooks';
import { NotificationTemplatesTable, NotificationTemplatesActionBar } from '../containers';

export const NotificationTemplatesPage: FC = () => {
    const { onFetch } = useNotificationTemplatesTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={NotificationTemplatesTableContext} onFetch={onFetch} name='notification-templates-table'>
                <NotificationTemplatesActionBar />
                <NotificationTemplatesTable />
            </NextTableProvider>
        </PageContent>
    );
};
