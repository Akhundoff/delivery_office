import React, { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { UsersTableContext } from '../context';
import { useUsersTable } from '../hooks';
import { UsersTable, UsersActionBar } from '../containers';

export const UsersPage: FC = () => {
    const { onFetch } = useUsersTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={UsersTableContext} onFetch={onFetch} name='users-table'>
                <UsersActionBar />
                <UsersTable />
            </NextTableProvider>
        </PageContent>
    );
};
