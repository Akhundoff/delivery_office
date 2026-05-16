import React, { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { DiscountUsersTableContext } from '../context';
import { discountUsersTableFetchUseCase } from '../use-cases/discount-users-table-fetch';
import { DiscountUsersTable, DiscountUsersActionBar } from '../containers';

export const DiscountUsersPage: FC = () => {
    return (
        <PageContent $contain={true}>
            <NextTableProvider context={DiscountUsersTableContext} onFetch={discountUsersTableFetchUseCase} name='discount-users-table'>
                <DiscountUsersActionBar />
                <DiscountUsersTable />
            </NextTableProvider>
        </PageContent>
    );
};
