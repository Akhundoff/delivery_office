import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CustomsDeclarationsTableContext } from '../context';
import { customsDeclarationsTableFetchUseCase } from '../use-cases/customs-declarations-table-fetch';
import { CustomsDeclarationsTable, CustomsDeclarationsActionBar } from '../containers';

export const CustomsDeclarationsPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={CustomsDeclarationsTableContext} onFetch={customsDeclarationsTableFetchUseCase} name='customs-declarations-table'>
                <CustomsDeclarationsActionBar />
                <CustomsDeclarationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
