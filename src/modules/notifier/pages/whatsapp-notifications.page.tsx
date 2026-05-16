import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { WhatsappNotificationsTableContext } from '../context';
import { useWhatsappNotificationsTable } from '../hooks';
import { WhatsappNotificationsTable, WhatsappNotificationsActionBar } from '../containers';

export const WhatsappNotificationsPage: FC = () => {
    const { onFetch } = useWhatsappNotificationsTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={WhatsappNotificationsTableContext} onFetch={onFetch} name='whatsapp-notifications-table'>
                <WhatsappNotificationsActionBar />
                <WhatsappNotificationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
