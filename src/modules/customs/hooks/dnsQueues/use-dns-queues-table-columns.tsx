import { useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { IDnsQueue } from '../../interfaces';

export const useDnsQueuesTableColumns = (): Column<IDnsQueue>[] => {
  const navigate = useBackgroundNavigate();

  return useMemo<Column<IDnsQueue>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        Cell: ({ row: { original } }: any) => (
          <StopPropagation>
            <Button
              icon={<Icons.FileTextOutlined />}
              size='small'
              onClick={() => navigate('/customs/dns-queues/preview/query', { withBackground: true, state: { dnsQueue: original } })}
            />
          </StopPropagation>
        ),
      },
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.action, id: 'action', Header: 'Əməliyyat' },
      { ...nextTableColumns.small, accessor: (r) => r.attempts, id: 'attempts', Header: 'Cəhd sayı' },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.statusCode,
        id: 'status_code',
        Header: 'Status',
        Cell: ({ cell: { value }, row: { original } }: any) => {
          if (!value) return null;
          return (
            <Space size={8}>
              <span>{value}</span>
              {!!original.response && (
                <Icons.FileTextOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/customs/dns-queues/preview/response', { withBackground: true, state: { dnsQueue: original } })}
                />
              )}
            </Space>
          );
        },
      },
      { ...nextTableColumns.date, accessor: (r) => r.updatedAt ?? '', id: 'updated_at', Header: 'Yenilənmə tarixi' },
      { ...nextTableColumns.date, accessor: (r) => r.retriedAt ?? '', id: 'retry_at', Header: 'Cəhd tarixi' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [navigate],
  );
};
