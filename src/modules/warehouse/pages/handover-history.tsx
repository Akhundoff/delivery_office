import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { HandoverQueuesTableContext } from '../context';
import { handoverHistoryTableFetchUseCase } from '../use-cases/handover-history-table-fetch';
import { HandoverQueuesActionBar, HandoverQueuesTable } from '../containers';

export const HandoverHistoryPage: FC = () => (
    <PageContent $contain>
        <NextTableProvider context={HandoverQueuesTableContext} onFetch={handoverHistoryTableFetchUseCase} name='handover-history-table'>
            <HandoverQueuesActionBar />
            <HandoverQueuesTable />
        </NextTableProvider>
    </PageContent>
);
