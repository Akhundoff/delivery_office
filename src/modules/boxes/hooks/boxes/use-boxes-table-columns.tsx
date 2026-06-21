import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Select, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { useBranches } from '@modules/branches';
import { BoxesService } from '../../services';
import { IBox } from '../../interfaces';
import { BoxesTableContext } from '../../context';

export const useBoxesTableColumns = (): Column<IBox>[] => {
  const { handleFetch } = useContext(BoxesTableContext);
  const navigate = useBackgroundNavigate();
  const branches = useBranches();

  const actionsColumn = useMemo<Column<IBox>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          { key: 'edit', label: 'Düzəliş et', icon: <Icons.EditOutlined />, onClick: () => navigate(`/boxes/${original.id}/update`, { withBackground: true }) },
          { key: 'history', label: 'Tarixçə', icon: <Icons.HistoryOutlined />, onClick: () => navigate(`/box-transfers/${original.id}/container`) },
          { type: 'divider' },
          {
            key: 'delete',
            label: 'Sil',
            icon: <Icons.DeleteOutlined />,
            danger: true,
            onClick: () =>
              Modal.confirm({
                title: 'Diqqət',
                content: 'Yeşiyi silməyə əminsinizmi?',
                okText: 'Sil',
                okType: 'danger',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const r = await BoxesService.delete([original.id]);
                  if (r.status === 200) handleFetch();
                  else message.error(r.data as string);
                },
              }),
          },
        ];
        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={['hover']}>
              <Button icon={<Icons.MoreOutlined />} size="small" />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<IBox>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'container_name', Header: 'Ad' },
      {
        accessor: (r) => r.branch?.name || '—',
        id: 'branch_id',
        Header: 'Filial',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear showSearch optionFilterProp="children" style={{ width: '100%' }} value={filterValue} onChange={setFilter} placeholder="Filial">
            {branches.data?.map((b) => (
              <Select.Option key={b.id} value={String(b.id)}>
                {b.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      { accessor: (r) => r.user?.name || '—', id: 'user_id', Header: 'İstifadəçi' },
      { ...nextTableColumns.small, accessor: (r) => r.declarationCount, id: 'declaration_count', Header: 'Bağlama sayı', filterable: false, Cell: ({ cell: { value } }: any) => `${value} ədəd` },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
    ],
    [branches.data],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
