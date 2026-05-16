import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { TicketTemplatesTableContext } from '../context';
import { useTicketTemplatesTable } from '../hooks';
import { TicketTemplatesTable, TicketTemplatesActionBar } from '../containers';

export const TicketTemplatesPage: FC = () => {
    const { onFetch } = useTicketTemplatesTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={TicketTemplatesTableContext} onFetch={onFetch} name='ticket-templates-table'>
                <TicketTemplatesActionBar />
                <TicketTemplatesTable />
            </NextTableProvider>
        </PageContent>
    );
};
