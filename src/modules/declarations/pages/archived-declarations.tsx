import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { ArchivedDeclarationsTableContext } from '../context';
import { archivedDeclarationsTableFetchUseCase } from '../use-cases/archived-declarations-table-fetch';
import { ArchivedDeclarationsActionBar, ArchivedDeclarationsTable } from '../containers';

export const ArchivedDeclarationsPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={ArchivedDeclarationsTableContext} onFetch={archivedDeclarationsTableFetchUseCase} name='archived-declarations-table'>
      <ArchivedDeclarationsActionBar />
      <ArchivedDeclarationsTable />
    </NextTableProvider>
  </PageContent>
);
