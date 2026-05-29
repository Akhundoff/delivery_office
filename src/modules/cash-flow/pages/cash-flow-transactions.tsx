import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CashFlowTransactionsTableContext } from '../context';
import { cashFlowTransactionsTableFetchUseCase } from '../use-cases/cash-flow-transactions-table-fetch';
import { CashFlowTransactionsActionBar, CashFlowTransactionsTable } from '../containers';

export const CashFlowTransactionsPage: FC = () => (
    <PageContent $contain>
        <NextTableProvider context={CashFlowTransactionsTableContext} onFetch={cashFlowTransactionsTableFetchUseCase} name='cash-flow-transactions-table'>
            <CashFlowTransactionsActionBar />
            <CashFlowTransactionsTable />
        </NextTableProvider>
    </PageContent>
);
