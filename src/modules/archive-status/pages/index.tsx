import { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { ArchiveStatusTableContext } from '../context';
import { archiveStatusTableFetchUseCase } from '../use-cases/table-fetch';
import { ArchiveStatusTable, ArchiveStatusActionBar } from '../containers';

export const ArchiveStatusPage: FC = () => {
  const { search } = useLocation();

  const defaultState = useMemo(() => {
    const params = new URLSearchParams(search);
    const filters: { id: string; value: string }[] = [];
    if (params.get('model_id')) filters.push({ id: 'model_id', value: params.get('model_id')! });
    if (params.get('object_id')) filters.push({ id: 'object_id', value: params.get('object_id')! });
    return filters.length > 0 ? { filters } : undefined;
  }, [search]);

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={ArchiveStatusTableContext} onFetch={archiveStatusTableFetchUseCase} name="archive-status-table" defaultState={defaultState}>
        <ArchiveStatusActionBar />
        <ArchiveStatusTable />
      </NextTableProvider>
    </PageContent>
  );
};
