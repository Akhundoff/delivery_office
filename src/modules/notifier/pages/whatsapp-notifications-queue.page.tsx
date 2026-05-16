import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { WhatsappNotificationsQueueTableContext } from '../context';
import { whatsappNotificationsQueueTableFetchUseCase } from '../use-cases/whatsapp-notifications-queue-table-fetch';
import { WhatsappNotificationsQueueTable, WhatsappNotificationsQueueActionBar } from '../containers';

export const WhatsappNotificationsQueuePage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={WhatsappNotificationsQueueTableContext} onFetch={whatsappNotificationsQueueTableFetchUseCase} name='whatsapp-notifications-queue-table'>
                <WhatsappNotificationsQueueActionBar />
                <WhatsappNotificationsQueueTable />
            </NextTableProvider>
        </PageContent>
    );
};
