import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { FlightsTableContext } from '../context';
import { flightsTableFetchUseCase } from '../use-cases/table-fetch';
import { FlightsTable, FlightsActionBar } from '../containers';

export const FlightsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={FlightsTableContext} onFetch={flightsTableFetchUseCase} name='flights-table'>
        <FlightsActionBar />
        <FlightsTable />
      </NextTableProvider>
    </PageContent>
  );
};
