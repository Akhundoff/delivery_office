import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { TicketTemplatesTableContext } from '../context';
import { ticketTemplatesTableFetchUseCase } from '../use-cases/table-fetch';
import { TicketTemplatesTable, TicketTemplatesActionBar } from '../containers';

export const TicketTemplatesPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={TicketTemplatesTableContext} onFetch={ticketTemplatesTableFetchUseCase} name='ticket-templates-table'>
                <TicketTemplatesActionBar />
                <TicketTemplatesTable />
            </NextTableProvider>
        </PageContent>
    );
};
