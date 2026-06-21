import { FC } from 'react';
import { PageContent } from '@shared/styled/page-content';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { useFlightDeclarationsTable } from '../hooks';
import { FlightDeclarationsActionBar, FlightDeclarationsTable } from '../containers';

export const FlightDeclarationsPage: FC = () => {
  const { onFetch, context, defaultState } = useFlightDeclarationsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={context} onFetch={onFetch} name="flight-declarations-table" useCache={false} defaultState={defaultState}>
        <FlightDeclarationsActionBar />
        <FlightDeclarationsTable />
      </NextTableProvider>
    </PageContent>
  );
};
