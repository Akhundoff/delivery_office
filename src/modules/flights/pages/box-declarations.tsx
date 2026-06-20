import { FC } from 'react';
import { PageContent } from '@shared/styled/page-content';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { useBoxDeclarationsTable } from '../hooks';
import { FlightDeclarationsActionBar, FlightDeclarationsTable } from '../containers';

export const BoxDeclarationsPage: FC = () => {
  const { onFetch, context, defaultState } = useBoxDeclarationsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={context} onFetch={onFetch} name="box-declarations-table" useCache={false} defaultState={defaultState}>
        <FlightDeclarationsActionBar />
        <FlightDeclarationsTable />
      </NextTableProvider>
    </PageContent>
  );
};
