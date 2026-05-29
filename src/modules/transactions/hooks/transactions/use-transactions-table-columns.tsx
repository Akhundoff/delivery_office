import React, { useCallback, useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useQuery } from 'react-query';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StatusesService } from '@modules/statuses/services';
import { ITransaction } from '../../interfaces';
import { TransactionsTableContext } from '../../context';
import { TransactionsService } from '../../services';

const TYPE_COLORS: Record<number, string> = { 1: 'green', 2: 'red' };

export const useTransactionsTableColumns = (): Column<ITransaction>[] => {
  const { handleFetch, selection, handleSelect } = useContext(TransactionsTableContext);

  const { data: statusesResult } = useQuery(['statuses-for-transactions', 4], () => StatusesService.getList({ per_page: 500, model_id: 4 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const actionsColumn = useMemo<Column<ITransaction>>(
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
                const result = await TransactionsService.changeStatus([original.id], s.id);
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
                content: 'Tranzaksiyanı silməyə əminsinizmi?',
                okType: 'danger',
                okText: 'Sil',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await TransactionsService.cancel([original.id]);
                  if (result.status === 200) { message.success('Tranzaksiya silindi.'); handleFetch(); }
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

  const baseColumns = useMemo<Column<ITransaction>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'M. kodu', id: 'user_id', accessor: (r) => r.user.id },
      { accessor: (r) => r.user.name, id: 'user_name', Header: 'Müştəri' },
      { accessor: (r) => r.object.model.name, id: 'model_id', Header: 'Bölmə' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.amount.value,
        id: 'amount',
        Header: 'Məbləğ',
        filterable: false,
        Cell: ({ row: { original } }: any) => `${original.amount.value.toFixed(2)} ${original.amount.currency.toUpperCase()}`,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.beforeBalance || '—', id: 'before_balance', Header: 'Əvv. balans', filterable: false },
      { ...nextTableColumns.small, accessor: (r) => r.cashback, id: 'cashback', Header: 'Kəşbək', filterable: false },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.type.name,
        id: 'type',
        Header: 'Tip',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag color={TYPE_COLORS[original.type.id]}>{original.type.name}</Tag>,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.paymentType.name, id: 'payment_type', Header: 'Əməliyyat', filterable: false },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.status.name,
        id: 'state_id',
        Header: 'Status',
        filterable: false,
        Cell: ({ value }: any) => <Tag>{value}</Tag>,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.confirmedBy?.name || '—', id: 'confirmed_by', Header: 'Təsdiq edən', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.description || '—', id: 'description', Header: 'Açıqlama', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
