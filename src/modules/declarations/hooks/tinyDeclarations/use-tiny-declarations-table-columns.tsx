import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Select, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useQuery } from 'react-query';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { OverCell } from '@shared/components/cells';
import { StopPropagation } from '@shared/components/stop-propagation';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { NextTableCheckboxFilter } from '@shared/modules/next-table/components/filters/checkbox';
import { useBackgroundNavigate } from '@shared/hooks';
import { useBranches } from '@modules/branches';
import { SettingsContext } from '@modules/settings';
import { MeContext } from '@modules/me';
import { IDeclaration } from '../../interfaces';
import { DeclarationsService } from '../../services';
import { DeclarationStatusTag } from '../../components/declaration-status-tag';
import { usePrint } from '../declarationDetail/use-print';
import { declarationQueryKeys } from '../../utils';

const PROVIDER_OPTIONS = [
  { value: '0', label: 'Daxili' },
  { value: '1', label: 'Trendyol' },
  { value: '2', label: 'Temu' },
];

const ROW_STATUS_OPTIONS = [
  { id: 9, name: 'Yerli anbarda' },
  { id: 88, name: 'Gömrükdə saxlanılıb' },
  { id: 160, name: 'Gömrük baxışı' },
];

const RowActions: React.FC<{ original: IDeclaration }> = ({ original }) => {
  const navigate = useBackgroundNavigate();
  const { can } = useContext(MeContext);
  const { printWaybill, printProformaInvoice } = usePrint(String(original.id));
  const waybillDisabled = original.status.id !== 7 && original.status.id !== 8;

  const orderIds = useQuery(
    ['declarations', original.id, 'orders'],
    async () => {
      const result = await DeclarationsService.getOrderIds(original.id);
      return result.status === 200 ? result.data : [];
    },
    { enabled: false, initialData: [] },
  );

  const items: MenuProps['items'] = [
    { key: 'details', label: 'Ətraflı bax', icon: <Icons.FileSearchOutlined />, onClick: () => navigate(`/declarations/${original.id}`) },
    { key: 'edit', label: 'Düzəliş et', icon: <Icons.EditOutlined />, onClick: () => navigate(`/declarations/${original.id}/update`, { withBackground: true }) },
    { type: 'divider' },
    {
      key: 'remove-from-flight',
      label: 'Uçuşdan çıxar',
      icon: <Icons.DeleteOutlined />,
      onClick: () =>
        Modal.confirm({
          title: 'Diqqət',
          content: 'Bağlamanı uçuşdan silməyə əminsinizmi?',
          onOk: async () => {
            const result = await DeclarationsService.removeFromFlight(original.id);
            if (result.status !== 200) message.error(result.data as string);
          },
        }),
    },
    { type: 'divider' },
    {
      key: 'handover',
      label: 'Təhvil ver',
      icon: <Icons.CheckCircleOutlined />,
      disabled: original.status.id !== 9,
      onClick: () => navigate(`/declarations/${original.id}/handover`, { withBackground: true }),
    },
    { key: 'return', label: 'İadə et', icon: <Icons.RollbackOutlined />, onClick: () => navigate(`/declarations/${original.id}/return`, { withBackground: true }) },
    { type: 'divider' },
    {
      key: 'print',
      label: 'Çap et',
      icon: <Icons.PrinterOutlined />,
      children: [
        { key: 'proforma', label: 'Proforma', onClick: () => printProformaInvoice() },
        { key: 'waybill', label: 'Yol vərəqəsi', disabled: waybillDisabled, onClick: () => printWaybill() },
      ],
    },
    { type: 'divider' },
    {
      key: 'orders',
      label: 'Sifarişlər',
      icon: <Icons.ShoppingCartOutlined />,
      disabled: !orderIds.data?.length,
      children: (orderIds.data || []).map((id, idx) => ({ key: `order-${idx}`, label: `Sifariş #${idx}`, onClick: () => navigate(`/orders/${id}`) })),
      onTitleClick: () => void orderIds.refetch(),
    },
    { type: 'divider' },
    { key: 'timeline', label: 'Status xəritəsi', icon: <Icons.FieldTimeOutlined />, onClick: () => navigate(`/declarations/${original.id}/timeline`, { withBackground: true }) },
    { type: 'divider' },
    {
      key: 'toggle-read',
      label: original.read ? 'Oxunmamış et' : 'Oxunmuş et',
      icon: <Icons.BookOutlined />,
      onClick: async () => {
        const result = await DeclarationsService.updateRead([original.id], !original.read);
        if (result.status !== 200) message.error(result.data as string);
      },
    },
    {
      key: 'status',
      label: 'Status dəyiş',
      icon: <Icons.AppstoreOutlined />,
      children: ROW_STATUS_OPTIONS.map((s) => ({
        key: `status-${s.id}`,
        label: s.name,
        onClick: () =>
          Modal.confirm({
            title: 'Diqqət',
            content: 'Status dəyişməyə əminsinizmi?',
            onOk: async () => {
              const result = await DeclarationsService.updateStatus([original.id], s.id);
              if (result.status !== 200) message.error(result.data as string);
            },
          }),
      })),
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: 'Sil',
      icon: <Icons.DeleteOutlined />,
      disabled: !can('declaration_cancel'),
      danger: true,
      onClick: () =>
        Modal.confirm({
          title: 'Diqqət',
          content: 'Bağlamanı silməyə əminsinizmi?',
          onOk: async () => {
            const result = await DeclarationsService.cancelDeclarations([original.id]);
            if (result.status !== 200) message.error(result.data as string);
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
};

export const useTinyDeclarationsTableColumns = (): Column<IDeclaration>[] => {
  const settings = useContext(SettingsContext);
  const branches = useBranches();

  const { data: statuses } = useQuery(
    ['declarations-statuses-filter'],
    async () => {
      const result = await DeclarationsService.getStatuses();
      return result.status === 200 ? result.data : [];
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const actionsColumn = useMemo<Column<IDeclaration>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => <RowActions original={original} />,
    }),
    [],
  );

  const baseColumns = useMemo<Column<IDeclaration>[]>(
    () => [
      {
        ...nextTableColumns.small,
        accessor: (r) => r.countryId,
        id: declarationQueryKeys.countryId,
        Header: 'Ölkə',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {(settings.data?.countries || []).map((c) => (
              <Select.Option key={c.id} value={c.id.toString()}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        ),
        Cell: ({ cell: { value } }: any) => settings.data?.countries.find((c) => c.id.toString() === value?.toString())?.name || '',
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.trackCode,
        id: declarationQueryKeys.trackCode,
        Header: 'İzləmə kodu',
        Cell: ({ cell: { value }, row: { original } }: any) => <Tag color={!original.read ? 'green' : 'default'}>{value}</Tag>,
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.status?.name,
        id: declarationQueryKeys.statusId,
        Header: 'Status',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {(statuses || []).map((s) => (
              <Select.Option key={s.id} value={s.id.toString()}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        ),
        Cell: ({ row: { original } }: any) => <DeclarationStatusTag id={original.status.id} name={original.status.name} />,
      },
      {
        ...nextTableColumns.smaller,
        accessor: (r) => r.paid,
        id: declarationQueryKeys.paid,
        Header: 'Ödəniş',
        Filter: NextTableCheckboxFilter,
        Cell: ({ cell: { value } }: any) => (value ? <Icons.CheckOutlined style={{ color: '#52c41a' }} /> : <Icons.CloseOutlined style={{ color: '#ff4d4f' }} />),
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.trendyol,
        id: 'trendyol',
        Header: 'Provayder',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {PROVIDER_OPTIONS.map((o) => (
              <Select.Option key={o.value} value={o.value}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
        ),
        Cell: ({ cell: { value } }: any) => PROVIDER_OPTIONS.find((o) => Number(o.value) === value)?.label || '—',
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.weight,
        id: declarationQueryKeys.weight,
        Header: 'Çəki',
        filterable: false,
        Cell: ({ cell: { value } }: any) => (value != null ? `${Number(value).toFixed(2)} kq` : '—'),
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.deliveryPrice,
        id: declarationQueryKeys.deliveryPrice,
        Header: 'Çatdırılma qiyməti',
        filterable: false,
        Cell: ({ cell: { value } }: any) => (value != null ? `${Number(value).toFixed(2)} $` : '—'),
      },
      {
        ...nextTableColumns.smaller,
        accessor: (r) => r.quantity,
        id: declarationQueryKeys.quantity,
        Header: 'Say',
        filterable: false,
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.type,
        id: declarationQueryKeys.type,
        Header: 'Tərkibi',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            <Select.Option value="1">Maye</Select.Option>
            <Select.Option value="2">Digər</Select.Option>
          </Select>
        ),
        Cell: ({ cell: { value } }: any) => (value === 'liquid' ? 'Maye' : 'Digər'),
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.branch?.name,
        id: declarationQueryKeys.branchId,
        Header: 'Filial',
        Cell: OverCell,
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select showSearch filterOption={filterOption} allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {branches.data?.map((b) => (
              <Select.Option key={b.id} value={b.id.toString()}>
                {b.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.box?.name,
        id: declarationQueryKeys.boxId,
        Header: 'Yeşik',
      },
    ],
    [branches.data, settings.data, statuses],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
