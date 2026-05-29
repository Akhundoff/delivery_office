import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { HandoverQueuesTableContext } from '../context';
import { handoverQueuesTableFetchUseCase } from '../use-cases/handover-queues-table-fetch';
import { HandoverQueuesActionBar, HandoverQueuesTable } from '../containers';

export const HandoverQueuesPage: FC = () => (
    <PageContent $contain>
        <NextTableProvider context={HandoverQueuesTableContext} onFetch={handoverQueuesTableFetchUseCase} name='handover-queues-table'>
            <HandoverQueuesActionBar />
            <HandoverQueuesTable />
        </NextTableProvider>
    </PageContent>
);
