import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CouriersTableContext } from '../context';
import { couriersTableFetchUseCase } from '../use-cases/table-fetch';
import { CouriersActionBar, CouriersTable } from '../containers';

export const CouriersPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={CouriersTableContext} onFetch={couriersTableFetchUseCase} name='couriers-table'>
      <CouriersActionBar />
      <CouriersTable />
    </NextTableProvider>
  </PageContent>
);
