import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { BoxTransfersTableContext } from '../context';
import { boxTransfersTableFetchUseCase } from '../use-cases/box-transfers-table-fetch';
import { BoxTransfersActionBar, BoxTransfersTable } from '../containers';
import { BoxTransfersRequestType } from '../interfaces';

const filterKeyMap: Record<BoxTransfersRequestType, string> = {
  branch: 'branch_id',
  declaration: 'declaration_id',
  container: 'container_id',
};

export const BoxTransfersPage: FC = () => {
  const { id, type } = useParams<{ id: string; type: BoxTransfersRequestType }>();
  const resolvedType: BoxTransfersRequestType = (type as BoxTransfersRequestType) || 'branch';

  const defaultState = useMemo(
    () => ({
      filters: [{ id: filterKeyMap[resolvedType], value: id ? Number(id) : undefined }],
      hiddenColumns: resolvedType === 'declaration' ? ['track_code'] : [],
    }),
    [id, resolvedType],
  );

  return (
    <PageContent $contain>
      <NextTableProvider
        key={`${resolvedType}-${id}`}
        context={BoxTransfersTableContext}
        onFetch={boxTransfersTableFetchUseCase(id, resolvedType)}
        name="box-transfers-table"
        useCache={false}
        defaultState={defaultState}
      >
        <BoxTransfersActionBar />
        <BoxTransfersTable />
      </NextTableProvider>
    </PageContent>
  );
};
