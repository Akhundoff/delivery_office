import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { PostDeclarationsTableContext } from '../context';
import { postDeclarationsTableFetchUseCase } from '../use-cases/post-declarations-table-fetch';
import { PostDeclarationsTable, PostDeclarationsActionBar } from '../containers';

export const PostDeclarationsPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={PostDeclarationsTableContext} onFetch={postDeclarationsTableFetchUseCase} name='post-declarations-table'>
                <PostDeclarationsActionBar />
                <PostDeclarationsTable />
            </NextTableProvider>
        </PageContent>
    );
};
