import { useMemo } from 'react';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { IModel } from '../../interfaces';

export const useModelsTableColumns = (): Column<IModel>[] => {
  return useMemo<Column<IModel>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
      { ...nextTableColumns.small, accessor: (r) => r.sort || '—', id: 'sort', Header: 'Sıra', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
      { accessor: (r) => r.description || '—', id: 'descr', Header: 'Açıqlama' },
    ],
    [],
  );
};
