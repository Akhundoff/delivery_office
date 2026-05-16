import React, { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { DeclarationsTableContext } from '../context';
import { useDeclarationsTable } from '../hooks';
import { DeclarationsTable, DeclarationsActionBar } from '../containers';

export const DeclarationsPage: FC = () => {
    const { onFetch } = useDeclarationsTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={DeclarationsTableContext} onFetch={onFetch} name='declarations-table'>
                <DeclarationsActionBar />
                <DeclarationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
