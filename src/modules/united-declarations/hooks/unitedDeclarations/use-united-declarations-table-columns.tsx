import React, { useMemo } from 'react';
import { Button, Dropdown, MenuProps, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { IDeclaration } from '@modules/declarations/interfaces';

export const useUnitedDeclarationsTableColumns = (): Column<IDeclaration>[] => {
  const actionsColumn = useMemo<Column<IDeclaration>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'open',
            label: 'Bağlamaya bax',
            icon: <Icons.EyeOutlined />,
            onClick: () => window.open(`/declarations/${original.id}`, '_blank'),
          },
        ];

        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={['hover']}>
              <Button icon={<Icons.MoreOutlined />} size='small' />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [],
  );

  const baseColumns = useMemo<Column<IDeclaration>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'M. kodu', id: 'user_id', accessor: (r) => r.user.id },
      { accessor: (r) => r.user.name, id: 'user_name', Header: 'Müştəri' },
      { ...nextTableColumns.normal, accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { ...nextTableColumns.normal, accessor: (r) => r.globalTrackCode || '—', id: 'global_track_code', Header: 'Q.İ kodu' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.status.name,
        id: 'state_id',
        Header: 'Status',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag>{original.status.name}</Tag>,
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.paid,
        id: 'payed',
        Header: 'Ödənilib',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag color={original.paid ? 'green' : 'red'}>{original.paid ? 'Bəli' : 'Xeyr'}</Tag>,
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.approved,
        id: 'customs',
        Header: 'Bəyan',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag color={original.approved ? 'green' : 'default'}>{original.approved ? 'Bəli' : 'Xeyr'}</Tag>,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.weight ?? '—', id: 'weight', Header: 'Çəki', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.price ?? '—', id: 'price', Header: 'Qiymət', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.flight?.name || '—', id: 'flight_name', Header: 'Uçuş' },
      { ...nextTableColumns.normal, accessor: (r) => r.branch?.name || '—', id: 'branch_id', Header: 'Filial' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
