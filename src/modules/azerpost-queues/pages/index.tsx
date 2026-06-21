import { FC, useMemo } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { AzerpostQueuesTableContext } from '../context';
import { azerpostQueuesTableFetchUseCase } from '../use-cases/table-fetch';
import { AzerpostQueuesTable, AzerpostQueuesActionBar } from '../containers';

const defaultState = { filters: [{ id: 'executed', value: '1' }] };

export const AzerpostQueuesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={AzerpostQueuesTableContext} onFetch={azerpostQueuesTableFetchUseCase} name="azerpost-queues-table" defaultState={defaultState}>
        <AzerpostQueuesActionBar />
        <AzerpostQueuesTable />
      </NextTableProvider>
    </PageContent>
  );
};
