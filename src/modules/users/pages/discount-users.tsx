import React, { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { DiscountUsersTableContext } from '../context';
import { useDiscountUsersTable } from '../hooks';
import { DiscountUsersTable, DiscountUsersActionBar } from '../containers';

export const DiscountUsersPage: FC = () => {
    const { onFetch } = useDiscountUsersTable();

    return (
        <PageContent $contain={true}>
            <NextTableProvider context={DiscountUsersTableContext} onFetch={onFetch} name='discount-users-table'>
                <DiscountUsersActionBar />
                <DiscountUsersTable />
            </NextTableProvider>
        </PageContent>
    );
};
