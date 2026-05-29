import React, { useMemo } from 'react';
import { Button, Dropdown, MenuProps, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { IUnitedReturn } from '../../interfaces';

export const useUnitedReturnsTableColumns = (): Column<IUnitedReturn>[] => {
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<IUnitedReturn>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/united-returns/${original.id}/update`, { withBackground: true }),
          },
          {
            key: 'print',
            label: 'Etiket çap et',
            icon: <Icons.FileOutlined />,
            disabled: !original.labelUrl,
            onClick: () => { if (original.labelUrl) window.open(original.labelUrl, '_blank'); },
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
    [navigate],
  );

  const baseColumns = useMemo<Column<IUnitedReturn>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.barcode, id: 'barcode', Header: 'Barkod' },
      { ...nextTableColumns.normal, accessor: (r) => r.weight, id: 'weight', Header: 'Çəki', filterable: false, Cell: ({ value }: any) => <>{value} kq</> },
      { ...nextTableColumns.normal, accessor: (r) => r.branch.name || '—', id: 'branch_id', Header: 'Filial' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.state.name || '—',
        id: 'state_id',
        Header: 'Status',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag>{original.state.name || '—'}</Tag>,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.note || '—', id: 'note', Header: 'Qeyd', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
