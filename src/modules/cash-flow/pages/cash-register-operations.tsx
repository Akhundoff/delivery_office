import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CashRegisterOperationsTableContext } from '../context';
import { cashRegisterOperationsTableFetchUseCase } from '../use-cases/cash-register-operations-table-fetch';
import { CashRegisterOperationsActionBar, CashRegisterOperationsTable } from '../containers';

export const CashRegisterOperationsPage: FC = () => (
    <PageContent $contain>
        <NextTableProvider context={CashRegisterOperationsTableContext} onFetch={cashRegisterOperationsTableFetchUseCase} name='cash-register-operations-table'>
            <CashRegisterOperationsActionBar />
            <CashRegisterOperationsTable />
        </NextTableProvider>
    </PageContent>
);
