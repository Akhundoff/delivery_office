import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CustomsDeclarationsTableContext } from '../context';
import { useCustomsDeclarationsTable } from '../hooks';
import { CustomsDeclarationsTable, CustomsDeclarationsActionBar } from '../containers';

export const CustomsDeclarationsPage: FC = () => {
    const { onFetch } = useCustomsDeclarationsTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={CustomsDeclarationsTableContext} onFetch={onFetch} name='customs-declarations-table'>
                <CustomsDeclarationsActionBar />
                <CustomsDeclarationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
