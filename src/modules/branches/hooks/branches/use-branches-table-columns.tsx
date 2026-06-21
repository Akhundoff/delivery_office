import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Select, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { NextTableCheckboxFilter } from '@shared/modules/next-table/components/filters/checkbox';
import { NextTableCheckCell } from '@shared/modules/next-table/components/cells/check';
import { useBackgroundNavigate } from '@shared/hooks';
import { MeContext } from '@modules/me/context/context';
import { StatusesService } from '@modules/statuses/services';

import { BranchesService } from '../../services';
import { IBranchListItem } from '../../interfaces';
import { BranchesTableContext } from '../../context';
import { useBranches } from './use-branches';

export const useBranchesTableColumns = (): Column<IBranchListItem>[] => {
  const { handleFetch } = useContext(BranchesTableContext);
  const { can } = useContext(MeContext);
  const navigate = useBackgroundNavigate();
  const branches = useBranches();
  const { data: statusesResult } = useQuery(['statuses-for-branches', 40], () => StatusesService.getList({ per_page: 500, model_id: 40 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const actionsColumn = useMemo<Column<IBranchListItem>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [];

        if (can('branch_edit')) {
          items.push({
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/branches/${original.id}/update`, { withBackground: true }),
          });
        }

        if (can('branch_delete')) {
          if (items.length) items.push({ type: 'divider' });
          items.push({
            key: 'delete',
            label: 'Sil',
            icon: <Icons.DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Diqqət',
                content: 'Sifarişi silməyə əminsinizmi?',
                onOk: async () => {
                  const result = await BranchesService.delete([original.id]);
                  if (result.status === 200) {
                    handleFetch();
                  } else {
                    message.error(result.data as string);
                  }
                },
              });
            },
          });
        }

        if (!items.length) return null;

        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={['hover']}>
              <Button icon={<Icons.MoreOutlined />} size="small" />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [navigate, handleFetch, can],
  );

  const baseColumns = useMemo<Column<IBranchListItem>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { ...nextTableColumns.large, accessor: (r) => r.name, id: 'name', Header: 'Ad' },
      {
        ...nextTableColumns.large,
        accessor: (r) => r.company?.name,
        id: 'company_name',
        Header: 'Şirkət adı',
      },
      {
        ...nextTableColumns.large,
        accessor: (r) => r.parent?.name,
        id: 'parent_id',
        Header: 'Üst filial',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {branches.data?.map((b) => (
              <Select.Option key={b.id} value={b.id.toString()}>
                {b.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      { accessor: (r) => r.descr, id: 'descr', Header: 'Açıqlama' },
      {
        ...nextTableColumns.smaller,
        accessor: (r) => r.isBranch,
        id: 'is_branch',
        Header: 'Filial',
        Cell: NextTableCheckCell,
        Filter: NextTableCheckboxFilter,
      },
      {
        ...nextTableColumns.large,
        accessor: (r) => r.status?.name,
        id: 'status_id',
        Header: 'Status',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {statuses.map((s: any) => (
              <Select.Option key={s.id} value={s.id.toString()}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        ),
        Cell: ({ cell: { value } }: any) => (value ? <Tag>{value}</Tag> : null),
      },
      {
        ...nextTableColumns.date,
        accessor: (r) => r.createdAt,
        id: 'created_at',
        Header: 'Yaradılıb',
      },
    ],
    [branches, statuses],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
