import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { SortingsTableContext, NonSortedDeclarationsTableContext } from '../context';
import { sortingsTableFetchUseCase, nonSortedDeclarationsTableFetchUseCase } from '../use-cases/table-fetch';
import { SortingsActionBar, SortingsTable, SortingDetails, NonSortedDeclarationsTable, NewBranchTransfer } from '../containers';

export const SortingsPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={SortingsTableContext} onFetch={sortingsTableFetchUseCase} name="sortings-table">
      <SortingsActionBar />
      <SortingsTable />
    </NextTableProvider>
  </PageContent>
);

export const SortingDetailsPage: FC = () => <SortingDetails />;

export const NonSortedDeclarationsPage: FC = () => {
  const { flightId } = useParams<{ flightId: string }>();
  return (
    <PageContent $contain>
      <NextTableProvider key={flightId} context={NonSortedDeclarationsTableContext} onFetch={nonSortedDeclarationsTableFetchUseCase(flightId)} name="non-sorted-declarations-table">
        <NonSortedDeclarationsTable />
      </NextTableProvider>
    </PageContent>
  );
};

export const NewBranchTransferPage: FC = () => <NewBranchTransfer />;
