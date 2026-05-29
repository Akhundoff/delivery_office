import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { SupportsTableContext } from '../context';
import { supportsTableFetchUseCase } from '../use-cases/table-fetch';
import { SupportsActionBar, SupportsTable, SupportDetails } from '../containers';

export const SupportsPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={SupportsTableContext} onFetch={supportsTableFetchUseCase} name="supports-table">
      <SupportsActionBar />
      <SupportsTable />
    </NextTableProvider>
  </PageContent>
);

export const SupportDetailsPage: FC = () => <SupportDetails />;
