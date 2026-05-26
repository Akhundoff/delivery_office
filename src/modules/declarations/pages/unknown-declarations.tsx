import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { UnknownDeclarationsTableContext } from '../context';
import { unknownDeclarationsTableFetchUseCase } from '../use-cases/unknown-declarations-table-fetch';
import { UnknownDeclarationsTable, UnknownDeclarationsActionBar } from '../containers';

export const UnknownDeclarationsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={UnknownDeclarationsTableContext} onFetch={unknownDeclarationsTableFetchUseCase} name='unknown-declarations-table'>
        <UnknownDeclarationsActionBar />
        <UnknownDeclarationsTable />
      </NextTableProvider>
    </PageContent>
  );
};
