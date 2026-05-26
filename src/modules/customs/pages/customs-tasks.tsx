import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CustomsTasksTableContext } from '../context';
import { customsTasksTableFetchUseCase } from '../use-cases/customs-tasks-table-fetch';
import { CustomsTasksTable, CustomsTasksActionBar } from '../containers';

export const CustomsTasksPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CustomsTasksTableContext} onFetch={customsTasksTableFetchUseCase} name='customs-tasks-table'>
        <CustomsTasksActionBar />
        <CustomsTasksTable />
      </NextTableProvider>
    </PageContent>
  );
};
