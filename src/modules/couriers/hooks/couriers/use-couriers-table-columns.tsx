import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useQuery } from 'react-query';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StatusesService } from '@modules/statuses/services';
import { ICourier } from '../../interfaces';
import { CouriersTableContext } from '../../context';
import { CouriersService } from '../../services';

export const useCouriersTableColumns = (): Column<ICourier>[] => {
  const { handleFetch } = useContext(CouriersTableContext);

  const { data: statusesResult } = useQuery(['statuses-for-couriers', 3], () => StatusesService.getList({ per_page: 500, model_id: 3 }));
  const statuses = useMemo(() => (statusesResult?.status === 200 ? statusesResult.data.data : []), [statusesResult]);

  const actionsColumn = useMemo<Column<ICourier>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const statusItems: MenuProps['items'] = statuses.map((s) => ({
          key: `status-${s.id}`,
          label: s.name,
          onClick: () =>
            Modal.confirm({
              title: 'Diqqət',
              content: `Statusu "${s.name}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
              onOk: async () => {
                const result = await CouriersService.changeStatus([original.id], s.id);
                if (result.status === 200) { message.success('Status dəyişdirildi.'); handleFetch(); }
                else message.error(result.data as string);
              },
            }),
        }));

        const items: MenuProps['items'] = [
          { key: 'change-status', label: 'Statusu dəyiş', icon: <Icons.AppstoreOutlined />, children: statusItems },
          { type: 'divider' as const },
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
                  if (result.status === 200) { message.success('Kuryer silindi.'); handleFetch(); }
                  else message.error(result.data as string);
                },
              }),
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
    [handleFetch, statuses],
  );

  const baseColumns = useMemo<Column<ICourier>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'M. kodu', id: 'user_id', accessor: (r) => r.user.id },
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
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag>{original.status.name}</Tag>,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.price, id: 'price', Header: 'Qiymət (₺)', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.totalPrice, id: 'total_price', Header: 'Toplam (₼)', filterable: false },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.paid,
        id: 'payed',
        Header: 'Ödənilib',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag color={original.paid ? 'green' : 'red'}>{original.paid ? 'Bəli' : 'Xeyr'}</Tag>,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.recipient || '—', id: 'recipient', Header: 'Qəbul edən', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.phoneNumber || '—', id: 'phone', Header: 'Telefon', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.region.name || '—', id: 'region_id', Header: 'Rayon' },
      { ...nextTableColumns.normal, accessor: (r) => r.address || '—', id: 'address', Header: 'Ünvan', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
