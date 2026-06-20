import { useMemo } from 'react';
import { Column } from 'react-table';
import { Select } from 'antd';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { useBranches } from '@modules/branches';
import { INonSortedDeclaration } from '../../interfaces';

export const useNonSortedDeclarationsTableColumns = (): Column<INonSortedDeclaration>[] => {
  const branches = useBranches();

  return useMemo(
    () => [
      { accessor: (r) => r.user.id, id: 'user_id', Header: 'M. kodu' },
      { ...nextTableColumns.large, accessor: (r) => r.user.name, id: 'user_name', Header: 'Müştəri', filterable: false },
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      {
        ...nextTableColumns.large,
        accessor: (r) => r.branch?.name || '—',
        id: 'branch_id',
        Header: 'Filial',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select showSearch filterOption={filterOption} allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {branches.data?.map((b) => (
              <Select.Option key={b.id} value={b.id.toString()}>
                {b.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
    ],
    [branches.data],
  );
};
