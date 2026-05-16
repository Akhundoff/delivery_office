import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CustomsPostsTableContext } from '../context';
import { useCustomsPostsTable } from '../hooks';
import { CustomsPostsTable, CustomsPostsActionBar } from '../containers';

export const CustomsPostsPage: FC = () => {
    const { onFetch } = useCustomsPostsTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={CustomsPostsTableContext} onFetch={onFetch} name='customs-posts-table'>
                <CustomsPostsActionBar />
                <CustomsPostsTable />
            </NextTableProvider>
        </PageContent>
    );
};
