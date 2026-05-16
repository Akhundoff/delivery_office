import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CustomsPostsTableContext } from '../context';
import { customsPostsTableFetchUseCase } from '../use-cases/customs-posts-table-fetch';
import { CustomsPostsTable, CustomsPostsActionBar } from '../containers';

export const CustomsPostsPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={CustomsPostsTableContext} onFetch={customsPostsTableFetchUseCase} name='customs-posts-table'>
                <CustomsPostsActionBar />
                <CustomsPostsTable />
            </NextTableProvider>
        </PageContent>
    );
};
