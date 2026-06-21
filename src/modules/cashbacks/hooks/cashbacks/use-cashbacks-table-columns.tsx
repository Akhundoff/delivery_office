import { useMemo } from 'react';
import { Column } from 'react-table';
import { Select, Tag } from 'antd';
import { useQuery } from 'react-query';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StatusesService } from '@modules/statuses/services';
import { ICashback } from '../../interfaces';

export const useCashbacksTableColumns = (): Column<ICashback>[] => {
  const { data: statusesResult } = useQuery(['statuses-for-cashbacks', 35], () => StatusesService.getList({ per_page: 500, model_id: 35 }), { staleTime: 5 * 60 * 1000 });
  const statuses = useMemo(() => (statusesResult?.status === 200 ? statusesResult.data.data : []), [statusesResult]);

  return useMemo<Column<ICashback>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { ...nextTableColumns.small, accessor: (r) => r.client.id, id: 'user_id', Header: 'Müştəri kodu' },
      { accessor: (r) => r.client.name, id: 'user_name', Header: 'Müştəri adı', filterable: false },
      { accessor: (r) => r.amount, id: 'cashback', Header: 'Kəşbək məbləği', filterable: false },
      { accessor: (r) => r.count, id: 'cashback_count', Header: 'Ödəniş sayı', filterable: false },
      {
        accessor: (r) => r.status?.name,
        id: 'state_id',
        Header: 'Statusu',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {statuses.map((s) => (
              <Select.Option key={s.id} value={s.id.toString()}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        ),
        Cell: ({ row: { original } }: any) => (original.status?.name ? <Tag color="blue">{original.status.name}</Tag> : null),
      },
    ],
    [statuses],
  );
};
