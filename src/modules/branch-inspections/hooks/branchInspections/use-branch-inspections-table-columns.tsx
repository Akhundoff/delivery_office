import React, { useMemo } from 'react';
import { Button, Dropdown, MenuProps, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { IBranchInspection } from '../../interfaces';

const STATE_COLORS: Record<number, string> = {
  155: 'blue',
  156: 'orange',
  157: 'green',
  158: 'red',
};

export const useBranchInspectionsTableColumns = (): Column<IBranchInspection>[] => {
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<IBranchInspection>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'details',
            label: 'Ətraflı',
            icon: <Icons.EyeOutlined />,
            onClick: () => navigate(`/branch-inspections/${original.id}/details`, { withBackground: true }),
          },
          {
            key: 'scan',
            label: 'Scan et',
            icon: <Icons.ScanOutlined />,
            disabled: original.stateId !== 155 && original.stateId !== 156,
            onClick: () => navigate(`/branch-inspections/${original.id}/scan`),
          },
          {
            key: 'report',
            label: 'Hesabata bax',
            icon: <Icons.FileTextOutlined />,
            disabled: original.stateId !== 157,
            onClick: () => navigate(`/branch-inspections/${original.id}/report`, { withBackground: true }),
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

  const baseColumns = useMemo<Column<IBranchInspection>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.branch.name, id: 'branch_id', Header: 'Filial' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.state.name,
        id: 'state_id',
        Header: 'Status',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag color={STATE_COLORS[original.stateId]}>{original.state.name}</Tag>,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.createdByUser.name, id: 'created_by', Header: 'Yaradan', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.executedByUser?.name || '—', id: 'executed_by', Header: 'İcraçı', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.deadline.value, id: 'deadline', Header: 'Son tarix', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.deadline.left, id: 'deadline_left', Header: 'Qalan', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.note || '—', id: 'note', Header: 'Qeyd', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradıldı' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
