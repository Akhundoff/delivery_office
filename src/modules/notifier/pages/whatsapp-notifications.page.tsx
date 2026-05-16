import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { WhatsappNotificationsTableContext } from '../context';
import { whatsappNotificationsTableFetchUseCase } from '../use-cases/whatsapp-notifications-table-fetch';
import { WhatsappNotificationsTable, WhatsappNotificationsActionBar } from '../containers';

export const WhatsappNotificationsPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={WhatsappNotificationsTableContext} onFetch={whatsappNotificationsTableFetchUseCase} name='whatsapp-notifications-table'>
                <WhatsappNotificationsActionBar />
                <WhatsappNotificationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
