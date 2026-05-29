import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useQuery } from 'react-query';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StatusesService } from '@modules/statuses/services';
import { IOrder } from '../../interfaces';
import { OrdersTableContext } from '../../context';
import { OrdersService } from '../../services';

export const useOrdersTableColumns = (): Column<IOrder>[] => {
  const { handleFetch } = useContext(OrdersTableContext);

  const { data: statusesResult } = useQuery(['statuses-for-orders', 1], () => StatusesService.getList({ per_page: 500, model_id: 1 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const actionsColumn = useMemo<Column<IOrder>>(
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
                const result = await OrdersService.changeStatus([original.id], s.id);
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
                content: 'Sifarişi silməyə əminsinizmi?',
                okType: 'danger',
                okText: 'Sil',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await OrdersService.cancel([original.id]);
                  if (result.status === 200) { message.success('Sifariş silindi.'); handleFetch(); }
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

  const baseColumns = useMemo<Column<IOrder>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'M. kodu', id: 'user_id', accessor: (r) => r.user.id },
      { accessor: (r) => r.user.name, id: 'user_name', Header: 'Müştəri' },
      { ...nextTableColumns.normal, accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { ...nextTableColumns.normal, accessor: (r) => r.product.shop, id: 'shop_name', Header: 'Mağaza' },
      { ...nextTableColumns.normal, accessor: (r) => r.product.price, id: 'price', Header: 'Qiymət', filterable: false },
      { ...nextTableColumns.small, accessor: (r) => r.product.quantity, id: 'quantity', Header: 'Say', filterable: false },
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
        accessor: (r) => r.isUrgent,
        id: 'urgent',
        Header: 'Təcili',
        filterable: false,
        Cell: ({ row: { original } }: any) => original.isUrgent ? <Tag color='red'>Bəli</Tag> : null,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.executor?.name || '—', id: 'executive', Header: 'İcraçı', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.declaration?.trackCode || '—', id: 'declaration_id', Header: 'Bağlama', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
