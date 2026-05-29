import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { TransactionsTableContext } from '../context';
import { transactionsTableFetchUseCase } from '../use-cases/table-fetch';
import { TransactionsActionBar, TransactionsTable } from '../containers';

export const TransactionsPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={TransactionsTableContext} onFetch={transactionsTableFetchUseCase} name='transactions-table'>
      <TransactionsActionBar />
      <TransactionsTable />
    </NextTableProvider>
  </PageContent>
);
