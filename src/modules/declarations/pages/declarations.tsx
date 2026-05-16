import React, { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { DeclarationsTableContext } from '../context';
import { declarationsTableFetchUseCase } from '../use-cases/declarations-table-fetch';
import { DeclarationsTable, DeclarationsActionBar } from '../containers';

export const DeclarationsPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={DeclarationsTableContext} onFetch={declarationsTableFetchUseCase} name='declarations-table'>
                <DeclarationsActionBar />
                <DeclarationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
