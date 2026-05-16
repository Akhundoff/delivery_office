import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { PostDeclarationsTableContext } from '../context';
import { usePostDeclarationsTable } from '../hooks';
import { PostDeclarationsTable, PostDeclarationsActionBar } from '../containers';

export const PostDeclarationsPage: FC = () => {
    const { onFetch } = usePostDeclarationsTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={PostDeclarationsTableContext} onFetch={onFetch} name='post-declarations-table'>
                <PostDeclarationsActionBar />
                <PostDeclarationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
