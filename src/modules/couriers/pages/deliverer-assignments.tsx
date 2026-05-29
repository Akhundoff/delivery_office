import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { DelivererAssignmentsTableContext } from '../context';
import { delivererAssignmentsTableFetchUseCase } from '../use-cases/deliverer-assignments-table-fetch';
import { DelivererAssignmentsActionBar, DelivererAssignmentsTable } from '../containers';

export const DelivererAssignmentsPage: FC = () => (
    <PageContent $contain>
        <NextTableProvider context={DelivererAssignmentsTableContext} onFetch={delivererAssignmentsTableFetchUseCase} name='deliverer-assignments-table'>
            <DelivererAssignmentsActionBar />
            <DelivererAssignmentsTable />
        </NextTableProvider>
    </PageContent>
);
