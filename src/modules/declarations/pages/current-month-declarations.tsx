import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { DeclarationsTable } from '../containers';
import { DeclarationsTableContext } from '../context';
import { currentMonthDeclarationsTableFetchUseCase } from '../use-cases/current-month-declarations-table-fetch';
import { declarationQueryKeys } from '../utils';

export const CurrentMonthDeclarationsPage: FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const defaultState = useMemo(
    () => ({
      hiddenColumns: [declarationQueryKeys.userId, declarationQueryKeys.userName],
      filters: [{ id: declarationQueryKeys.userId, value: userId }],
    }),
    [userId],
  );

  return (
    <PageContent $contain>
      <NextTableProvider
        context={DeclarationsTableContext}
        onFetch={currentMonthDeclarationsTableFetchUseCase}
        name={`current-month-declarations-${userId}`}
        defaultState={defaultState}
        useCache={false}
      >
        <DeclarationsTable />
      </NextTableProvider>
    </PageContent>
  );
};
