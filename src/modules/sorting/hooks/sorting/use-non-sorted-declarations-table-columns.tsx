import { useMemo } from 'react';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { INonSortedDeclaration } from '../../interfaces';

export const useNonSortedDeclarationsTableColumns = (): Column<INonSortedDeclaration>[] =>
  useMemo(
    () => [
      { ...nextTableColumns.small, accessor: (r) => r.declarationId, id: 'declaration_id', Header: 'Bağlama kodu' },
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { ...nextTableColumns.small, accessor: (r) => r.user.id, id: 'user_id', Header: 'M. kodu', filterable: false },
      { accessor: (r) => r.user.name, id: 'user_name', Header: 'Müştəri', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.branch?.name || '—', id: 'branch_id', Header: 'Filial', filterable: false },
    ],
    [],
  );
