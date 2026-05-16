import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { DeletedDeclarationsTableContext } from '../context';
import { useDeletedDeclarationsTable } from '../hooks';
import { DeletedDeclarationsActionBar, DeletedDeclarationsTable } from '../containers';

export const DeletedDeclarationsPage: FC = () => {
    const { onFetch } = useDeletedDeclarationsTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={DeletedDeclarationsTableContext} onFetch={onFetch} name='deleted-declarations-table'>
                <DeletedDeclarationsActionBar />
                <DeletedDeclarationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
