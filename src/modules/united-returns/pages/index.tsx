import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { UnitedReturnsTableContext } from '../context';
import { unitedReturnsTableFetchUseCase } from '../use-cases/table-fetch';
import { UnitedReturnsActionBar, UnitedReturnsTable, UnitedReturnExecution } from '../containers';

export const UnitedReturnsPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={UnitedReturnsTableContext} onFetch={unitedReturnsTableFetchUseCase} name="united-returns-table">
      <UnitedReturnsActionBar />
      <UnitedReturnsTable />
    </NextTableProvider>
  </PageContent>
);

export const UnitedReturnExecutionPage: FC = () => <UnitedReturnExecution />;
