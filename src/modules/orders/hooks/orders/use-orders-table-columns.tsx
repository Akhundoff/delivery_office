import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Select, Tag, Typography, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useQuery } from 'react-query';
import { StopPropagation } from '@shared/components/stop-propagation';
import { OverCell, CountryCell, CheckCell } from '@shared/components/cells';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { NextTableCheckboxFilter } from '@shared/modules/next-table/components/filters/checkbox';
import { useBackgroundNavigate } from '@shared/hooks';
import { SettingsContext } from '@modules/settings';
import { StatusesService } from '@modules/statuses/services';
import { IOrder } from '../../interfaces';
import { OrdersTableContext } from '../../context';
import { OrderStateTag } from '../../components';
import { OrdersService } from '../../services';
import { REJECTED_STATUS_ID, getCurrencySymbolByCountryId } from '../../constants';

export const useOrdersTableColumns = (): Column<IOrder>[] => {
  const { handleFetch } = useContext(OrdersTableContext);
  const navigate = useBackgroundNavigate();
  const settings = useContext(SettingsContext);

  const { data: statusesResult } = useQuery(['statuses-for-orders', 1], () => StatusesService.getList({ per_page: 500, model_id: 1 }));
  const statuses = useMemo(() => (statusesResult?.status === 200 ? statusesResult.data.data : []), [statusesResult]);

  const actionsColumn = useMemo<Column<IOrder>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const statusItems: MenuProps['items'] = statuses.map((s) => ({
          key: `status-${s.id}`,
          label: s.name,
          onClick: async () => {
            if (Number(s.id) === REJECTED_STATUS_ID) {
              navigate(`/orders/${original.id}/reject`, { withBackground: true });
              return;
            }
            message.loading({ content: 'Status dəyişdirilir...', duration: 0 });
            const result = await OrdersService.changeStatus([original.id], s.id);
            message.destroy();
            if (result.status === 200) handleFetch();
            else message.error(result.data as string);
          },
        }));

        const items: MenuProps['items'] = [
          {
            key: 'details',
            label: 'Ətraflı bax',
            icon: <Icons.FileSearchOutlined />,
            onClick: () => navigate(`/orders/${original.id}`, { withBackground: false }),
          },
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/orders/${original.id}/update`, { withBackground: true }),
          },
          { type: 'divider' as const },
          {
            key: 'declaration',
            label: 'Bağlama',
            icon: <Icons.FileSearchOutlined />,
            disabled: !original.declaration?.id,
            onClick: () => {
              if (!original.declaration?.id) {
                message.error('Bu sifarişə aid bağlama yoxdur');
                return;
              }
              navigate(`/declarations/${original.declaration.id}`, { withBackground: false });
            },
          },
          {
            key: 'product',
            label: 'Məhsul',
            icon: <Icons.LinkOutlined />,
            onClick: () => window.open(original.product.url, '_blank'),
          },
          { type: 'divider' as const },
          {
            key: 'timeline',
            label: 'Status xəritəsi',
            icon: <Icons.FieldTimeOutlined />,
            onClick: () => navigate(`/orders/${original.id}/timeline`, { withBackground: true }),
          },
          { type: 'divider' as const },
          {
            key: 'toggle-read',
            label: original.read ? 'Oxunmamış et' : 'Oxunmuş et',
            icon: <Icons.BookOutlined />,
            onClick: async () => {
              const result = await OrdersService.updateRead([original.id], original.read);
              if (result.status === 200) {
                handleFetch();
              } else message.error(result.data as string);
            },
          },
          { key: 'change-status', label: 'Status dəyiş', icon: <Icons.AppstoreOutlined />, children: statusItems },
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
                  if (result.status === 200) {
                    message.success('Sifariş silindi.');
                    handleFetch();
                  } else message.error(result.data as string);
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
    [handleFetch, navigate, statuses],
  );

  const baseColumns = useMemo<Column<IOrder>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'M. kodu', id: 'user_id', accessor: (r) => r.user.id },
      { accessor: (r) => r.user.name, id: 'user_name', Header: 'Müştəri', Cell: OverCell },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.countryId,
        id: 'country_id',
        Header: 'Ölkə',
        Cell: CountryCell,
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {(settings.data?.countries || []).map((country) => (
              <Select.Option key={country.id} value={country.id.toString()}>
                {country.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.trackCode,
        id: 'track_code',
        Header: 'İzləmə kodu',
        Cell: ({ cell: { value }, row: { original } }: any) => (
          <Tag color={!original.read ? 'green' : 'default'}>
            {value}&nbsp;
            <Icons.LinkOutlined />
          </Tag>
        ),
      },
      { ...nextTableColumns.normal, accessor: (r) => r.product.shop, id: 'shop_name', Header: 'Mağaza', Cell: OverCell },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.product.url,
        id: 'product_url',
        Header: 'Link',
        filterable: false,
        Cell: ({ row: { original } }: any) => (
          <a target="_blank" rel="noreferrer" href={original.product.url}>
            <Tag color={!original.read ? 'green' : 'default'}>
              <Icons.LinkOutlined /> Keçid et
            </Tag>
          </a>
        ),
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.product.price,
        id: 'price',
        Header: 'Məhsulun qiyməti',
        filterable: false,
        Cell: ({ cell: { value }, row: { original } }: any) => (
          <div>
            {value.toFixed(2)} {getCurrencySymbolByCountryId(original.countryId)}
            {!!original.debts.productPrice && (
              <Typography.Text type="danger">
                &nbsp;+&nbsp;
                {original.debts.productPrice.toFixed(2)} {getCurrencySymbolByCountryId(original.countryId)}
              </Typography.Text>
            )}
          </div>
        ),
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.product.internalShippingPrice,
        id: 'cargo_price',
        Header: 'D.K qiyməti',
        filterable: false,
        Cell: ({ cell: { value }, row: { original } }: any) => (
          <div>
            {value.toFixed(2)} {getCurrencySymbolByCountryId(original.countryId)}
            {!!original.debts.internalShippingPrice && (
              <Typography.Text type="danger">
                &nbsp;+&nbsp;
                {original.debts.internalShippingPrice.toFixed(2)} {getCurrencySymbolByCountryId(original.countryId)}
              </Typography.Text>
            )}
          </div>
        ),
      },
      { ...nextTableColumns.small, accessor: (r) => r.product.quantity, id: 'quantity', Header: 'Say', filterable: false },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.status.name,
        id: 'state_id',
        Header: 'Status',
        Cell: ({ row: { original } }: any) => <OrderStateTag id={original.status.id} name={original.status.name} />,
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {statuses.map((s) => (
              <Select.Option key={s.id} value={s.id.toString()}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        ...nextTableColumns.smaller,
        accessor: (r) => r.paid,
        id: 'payed',
        Header: 'Ödəniş',
        Filter: NextTableCheckboxFilter,
        Cell: CheckCell,
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.isUrgent,
        id: 'urgent',
        Header: 'Təcili',
        filterable: false,
        Cell: ({ row: { original } }: any) => (original.isUrgent ? <Tag color="red">Bəli</Tag> : null),
      },
      { ...nextTableColumns.small, accessor: (r) => r.executor?.name, id: 'executive', Header: 'Düzəliş edən', Cell: OverCell },
      { ...nextTableColumns.normal, accessor: (r) => r.declaration?.trackCode || '—', id: 'declaration_id', Header: 'Bağlama', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.expectedAt, id: 'waiting', Header: 'Gözlənilən tarix' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [settings.data?.countries, statuses],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
