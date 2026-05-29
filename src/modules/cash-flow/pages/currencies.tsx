import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CurrenciesTableContext } from '../context';
import { currenciesTableFetchUseCase } from '../use-cases/currencies-table-fetch';
import { CurrenciesTable } from '../containers';

export const CurrenciesPage: FC = () => (
    <PageContent $contain>
        <NextTableProvider context={CurrenciesTableContext} onFetch={currenciesTableFetchUseCase} name='currencies-table'>
            <CurrenciesTable />
        </NextTableProvider>
    </PageContent>
);
