import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CashRegistersTableContext } from '../context';
import { cashRegistersTableFetchUseCase } from '../use-cases/cash-registers-table-fetch';
import { CashRegistersActionBar, CashRegistersTable } from '../containers';

export const CashRegistersPage: FC = () => (
    <PageContent $contain>
        <NextTableProvider context={CashRegistersTableContext} onFetch={cashRegistersTableFetchUseCase} name='cash-registers-table'>
            <CashRegistersActionBar />
            <CashRegistersTable />
        </NextTableProvider>
    </PageContent>
);
