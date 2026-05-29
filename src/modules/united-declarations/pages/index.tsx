import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { UnitedDeclarationsTableContext } from '../context';
import { unitedDeclarationsTableFetchUseCase } from '../use-cases/table-fetch';
import { UnitedDeclarationsActionBar, UnitedDeclarationsTable } from '../containers';

export const UnitedDeclarationsPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={UnitedDeclarationsTableContext} onFetch={unitedDeclarationsTableFetchUseCase} name='united-declarations-table'>
      <UnitedDeclarationsActionBar />
      <UnitedDeclarationsTable />
    </NextTableProvider>
  </PageContent>
);
