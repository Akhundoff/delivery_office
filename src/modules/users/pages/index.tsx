import React, { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { UsersTableContext } from '../context';
import { usersTableFetchUseCase } from '../use-cases/users-table-fetch';
import { UsersTable, UsersActionBar } from '../containers';

export const UsersPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={UsersTableContext} onFetch={usersTableFetchUseCase} name='users-table'>
                <UsersActionBar />
                <UsersTable />
            </NextTableProvider>
        </PageContent>
    );
};
