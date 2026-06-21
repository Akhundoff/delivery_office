import React, { useCallback, useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Select, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useQuery } from 'react-query';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { NextTableCheckboxFilter } from '@shared/modules/next-table/components/filters/checkbox';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { urlMaker } from '@shared/utils';
import { useBackgroundNavigate } from '@shared/hooks';
import { MeContext } from '@modules/me';
import { useBranches } from '@modules/branches';
import { RegionsService } from '@modules/regions/services';
import { StatusesService } from '@modules/statuses/services';
import { ICourier } from '../../interfaces';
import { CouriersTableContext } from '../../context';
import { CouriersService } from '../../services';
import { CourierStateTag } from '../../components/courier-state-tag';

const RowActions: React.FC<{ original: ICourier }> = ({ original }) => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(CouriersTableContext);
  const { can } = useContext(MeContext);

  const { data: statusesResult } = useQuery(['statuses-for-couriers-row', 3], () => StatusesService.getList({ per_page: 500, model_id: 3 }), { staleTime: 5 * 60 * 1000 });
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const toggleRead = useCallback(async () => {
    const result = await CouriersService.updateRead([original.id], original.read);
    if (result.status === 200) handleFetch();
    else message.error(result.data as string);
  }, [original.id, original.read, handleFetch]);

  const printHanding = useCallback(() => {
    const token = document.cookie.match(/accessToken=([^;]+)/)?.[1] || '';
    window.open(urlMaker('/api/admin/couriers/handing', { courier_id: original.id, Authorization: token }));
  }, [original.id]);

  const statusChildren: MenuProps['items'] = statuses.map((s) => ({
    key: `row-status-${s.id}`,
    label: s.name,
    onClick: () =>
      Modal.confirm({
        title: 'Diqqət',
        content: `Statusu "${s.name}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
        onOk: async () => {
          const result = await CouriersService.changeStatus([original.id], s.id);
          if (result.status === 200) {
            message.success('Status dəyişdirildi.');
            handleFetch();
          } else message.error(result.data as string);
        },
      }),
  }));

  const items: MenuProps['items'] = [
    { key: 'details', label: 'Ətraflı bax', icon: <Icons.FileSearchOutlined />, onClick: () => navigate(`/couriers/${original.id}`) },
    { key: 'edit', label: 'Düzəliş et', icon: <Icons.EditOutlined />, onClick: () => navigate(`/couriers/${original.id}/update`, { withBackground: true }) },
    { type: 'divider' },
    { key: 'handover', label: 'Təhvil ver', icon: <Icons.CheckCircleOutlined />, onClick: () => navigate(`/couriers/${original.id}/handover`, { withBackground: true }) },
    { type: 'divider' },
    { key: 'print-handing', label: 'Təhvil sənədi', icon: <Icons.FileTextOutlined />, onClick: printHanding },
    { key: 'timeline', label: 'Status xəritəsi', icon: <Icons.FieldTimeOutlined />, onClick: () => navigate(`/couriers/${original.id}/timeline`, { withBackground: true }) },
    { type: 'divider' },
    { key: 'toggle-read', label: original.read ? 'Oxunmamış et' : 'Oxunmuş et', icon: <Icons.BookOutlined />, onClick: toggleRead },
    { key: 'change-status', label: 'Statusu dəyiş', icon: <Icons.AppstoreOutlined />, children: statusChildren },
    { type: 'divider' },
    ...(can('deletecourier')
      ? [
          {
            key: 'delete',
            label: 'Sil',
            icon: <Icons.DeleteOutlined />,
            danger: true,
            onClick: () =>
              Modal.confirm({
                title: 'Diqqət',
                content: 'Kuryeri silməyə əminsinizmi?',
                okType: 'danger',
                okText: 'Sil',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await CouriersService.cancel([original.id]);
                  if (result.status === 200) {
                    message.success('Kuryer silindi.');
                    handleFetch();
                  } else message.error(result.data as string);
                },
              }),
          },
        ]
      : []),
  ];

  return (
    <StopPropagation>
      <Dropdown menu={{ items }} trigger={['hover']}>
        <Button icon={<Icons.MoreOutlined />} size="small" />
      </Dropdown>
    </StopPropagation>
  );
};

export const useCouriersTableColumns = (): Column<ICourier>[] => {
  const { handleFetch } = useContext(CouriersTableContext);
  const branches = useBranches();

  const { data: regionsResult } = useQuery(['regions-for-couriers-filter'], () => RegionsService.getList({ per_page: 200 }), { staleTime: 5 * 60 * 1000 });
  const regions = useMemo(() => (regionsResult?.status === 200 ? regionsResult.data.data : []), [regionsResult]);

  const { data: statusesResult } = useQuery(['statuses-for-couriers', 3], () => StatusesService.getList({ per_page: 500, model_id: 3 }));
  const statuses = useMemo(() => (statusesResult?.status === 200 ? statusesResult.data.data : []), [statusesResult]);

  const { data: azerpostBranchesResult } = useQuery(['azerpost-branches-filter'], () => CouriersService.getAzerpostBranches(''));
  const azerpostBranches = useMemo(() => (azerpostBranchesResult?.status === 200 ? azerpostBranchesResult.data : []), [azerpostBranchesResult]);

  const actionsColumn = useMemo<Column<ICourier>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => <RowActions original={original} />,
    }),
    [],
  );

  const baseColumns = useMemo<Column<ICourier>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'M. kodu', id: 'user_id', accessor: (r) => r.user.id },
      { ...nextTableColumns.small, Header: 'Kuryer kodu', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.user.name, id: 'user_name', Header: 'Müştəri' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.declarations,
        id: 'declarations',
        Header: 'Bağlamalar',
        filterable: false,
        Cell: ({ row: { original } }: any) => <span>{original.declarations.length ? `${original.declarations.length} bağlama` : '—'}</span>,
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.status.name,
        id: 'state_id',
        Header: 'Status',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {statuses.map((s) => (
              <Select.Option key={s.id} value={s.id.toString()}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        ),
        Cell: ({ row: { original } }: any) => <CourierStateTag id={original.status.id} name={original.status.name} />,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.price, id: 'price', Header: 'Qiymət (₺)', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.totalPrice, id: 'total_price', Header: 'Toplam (₼)', filterable: false },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.paid,
        id: 'payed',
        Header: 'Ödənilib',
        Filter: NextTableCheckboxFilter,
        Cell: ({ row: { original } }: any) => <Tag color={original.paid ? 'green' : 'red'}>{original.paid ? 'Bəli' : 'Xeyr'}</Tag>,
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.isAzerpost,
        id: 'is_azerpost',
        Header: 'Azerpost',
        Filter: NextTableCheckboxFilter,
        Cell: ({ cell: { value } }: any) => (value ? <Icons.CheckOutlined style={{ color: '#52c41a' }} /> : <Icons.CloseOutlined style={{ color: '#ff4d4f' }} />),
      },
      { ...nextTableColumns.normal, accessor: (r) => r.recipient || '—', id: 'recipient', Header: 'Qəbul edən', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.phoneNumber || '—', id: 'phone', Header: 'Telefon', filterable: false },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.region.name || '—',
        id: 'region_id',
        Header: 'Rayon',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {regions.map((r) => (
              <Select.Option key={r.id} value={r.id.toString()}>
                {r.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.branch.name || '—',
        id: 'branch_index',
        Header: 'Azərpoçt Filial',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select showSearch filterOption={filterOption} allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {azerpostBranches.map((b) => (
              <Select.Option key={b.id} value={b.id.toString()}>
                {b.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.branch.name || '—',
        id: 'branch_id',
        Header: 'Filial',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select showSearch filterOption={filterOption} allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {(branches.data || []).map((b) => (
              <Select.Option key={b.id} value={b.id.toString()}>
                {b.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      { ...nextTableColumns.normal, accessor: (r) => r.address || '—', id: 'address', Header: 'Ünvan', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
    ],
    [statuses, regions, branches.data, azerpostBranches],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
