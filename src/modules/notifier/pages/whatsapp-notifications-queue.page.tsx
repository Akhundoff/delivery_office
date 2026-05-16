import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { WhatsappNotificationsQueueTableContext } from '../context';
import { useWhatsappNotificationsQueueTable } from '../hooks';
import { WhatsappNotificationsQueueTable, WhatsappNotificationsQueueActionBar } from '../containers';

export const WhatsappNotificationsQueuePage: FC = () => {
    const { onFetch } = useWhatsappNotificationsQueueTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={WhatsappNotificationsQueueTableContext} onFetch={onFetch} name='whatsapp-notifications-queue-table'>
                <WhatsappNotificationsQueueActionBar />
                <WhatsappNotificationsQueueTable />
            </NextTableProvider>
        </PageContent>
    );
};
