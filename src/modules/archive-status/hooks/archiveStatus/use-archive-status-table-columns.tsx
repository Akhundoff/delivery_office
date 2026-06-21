import { useMemo } from 'react';
import { Column } from 'react-table';
import { Select } from 'antd';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { IArchiveStatus } from '../../interfaces';
import { useModels } from '@modules/models';

export const useArchiveStatusTableColumns = (): Column<IArchiveStatus>[] => {
  const { data: models } = useModels();

  return useMemo<Column<IArchiveStatus>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.user?.name, id: 'user_name', Header: 'İcraçı' },
      {
        accessor: (r) => r.model?.name,
        id: 'model_id',
        Header: 'Model',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {(models || []).map((elem) => (
              <Select.Option key={elem.id} value={elem.id.toString()}>
                {elem.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      { accessor: (r) => r.objectId, id: 'object_id', Header: 'Obyekt' },
      {
        accessor: (r) => (r.state?.name ? `Status "${r.state.name}" olaraq dəyişdirildi` : ''),
        id: 'state_name',
        Header: 'Əməliyyat',
      },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Əməliyyat tarixi' },
    ],
    [models],
  );
};
