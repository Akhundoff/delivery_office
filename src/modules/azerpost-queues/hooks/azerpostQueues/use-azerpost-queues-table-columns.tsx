import { useMemo } from 'react';
import { Column } from 'react-table';
import { Select, Space, Tag } from 'antd';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { IAzerpostQueue } from '../../interfaces';

export const useAzerpostQueuesTableColumns = (): Column<IAzerpostQueue>[] => {
  const navigate = useBackgroundNavigate();

  return useMemo<Column<IAzerpostQueue>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.objectId, id: 'object_id', Header: 'Obyekt kod' },
      { accessor: (r) => r.requestMethod, id: 'request_method', Header: 'Metod' },
      {
        accessor: (r) => r.requestBody,
        id: 'body',
        Header: 'Body',
        filterable: false,
        Cell: ({ value, row: { original } }: any) =>
          value ? (
            <Space size={8}>
              <Tag onClick={() => navigate('/azerpost-queues/request-body', { withBackground: true, state: { azerpostQueue: original } })} color="green" style={{ cursor: 'pointer' }}>
                Məzmuna bax
              </Tag>
            </Space>
          ) : null,
      },
      {
        accessor: (r) => r.responseBody,
        id: 'response_body',
        Header: 'Response body',
        filterable: false,
        Cell: ({ value, row: { original } }: any) =>
          value ? (
            <Space size={8}>
              <Tag onClick={() => navigate('/azerpost-queues/response-body', { withBackground: true, state: { azerpostQueue: original } })} color="green" style={{ cursor: 'pointer' }}>
                Məzmuna bax
              </Tag>
            </Space>
          ) : null,
      },
      { accessor: (r) => r.statusCode, id: 'status_code', Header: 'Status kod' },
      {
        accessor: (r) => r.executed,
        id: 'executed',
        Header: 'Əməliyyat',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            <Select.Option value="1">İcra edilib</Select.Option>
            <Select.Option value="0">İcra edilməyib</Select.Option>
          </Select>
        ),
        Cell: ({ value }: any) => (value ? 'İcra edilib' : 'İcra edilməyib'),
      },
      { accessor: (r) => r.attempts, id: 'attempts', Header: 'Cəhd sayı' },
      { ...nextTableColumns.date, accessor: (r) => r.retryAt, id: 'retry_at', Header: 'Cəhd edildi' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [navigate],
  );
};
