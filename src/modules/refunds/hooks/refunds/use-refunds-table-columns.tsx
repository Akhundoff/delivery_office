import { useCallback, useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Select, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { useCargoes } from '@modules/cargoes/hooks';

import { RefundsService } from '../../services';
import { IRefund } from '../../interfaces';
import { RefundsTableContext } from '../../context';
import { usePrintSticker } from './use-print-sticker';

const CargoFilter = ({ column: { filterValue, setFilter } }: any) => {
  const cargoes = useCargoes();
  return (
    <Select value={filterValue} onChange={(v) => setFilter(v)} allowClear placeholder="Kargo seçin..." loading={cargoes.isLoading} style={{ width: '100%' }} size="small">
      {(cargoes.data || []).map((c) => (
        <Select.Option key={c.id} value={c.id}>
          {c.name}
        </Select.Option>
      ))}
    </Select>
  );
};

const DirectionFilter = ({ column: { filterValue, setFilter } }: any) => (
  <Select value={filterValue} onChange={(v) => setFilter(v)} allowClear placeholder="İstiqamət seçin..." style={{ width: '100%' }} size="small">
    <Select.Option value="AZERBAIJAN">Azərbaycan</Select.Option>
    <Select.Option value="TURKIYE">Türkiyə</Select.Option>
  </Select>
);

const StatusFilter = ({ column: { filterValue, setFilter } }: any) => {
  const { data: statusesResult } = useQuery(['statuses-for-refunds', 38], () => StatusesService.getList({ per_page: 500, model_id: 38 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];
  return (
    <Select value={filterValue} onChange={(v) => setFilter(v)} allowClear placeholder="Status seçin..." loading={!statusesResult} style={{ width: '100%' }} size="small">
      {statuses.map((s) => (
        <Select.Option key={s.id} value={s.id}>
          {s.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export const useRefundsTableColumns = (): Column<IRefund>[] => {
  const { handleFetch } = useContext(RefundsTableContext);
  const navigate = useBackgroundNavigate();
  const printSticker = usePrintSticker();

  const { data: statusesResult } = useQuery(['statuses-for-refunds-actions', 38], () => StatusesService.getList({ per_page: 500, model_id: 38 }));
  const statuses = useMemo(() => (statusesResult?.status === 200 ? statusesResult.data.data : []), [statusesResult]);

  const updateStatus = useCallback(
    async (refundId: number, stateId: number) => {
      message.loading({ key: 'refund-status', content: 'Status dəyişdirilir...', duration: 0 });
      const result = await RefundsService.changeStatus(refundId, stateId);
      if (result.status === 200) {
        message.success({ key: 'refund-status', content: 'Status dəyişdirildi.' });
        handleFetch();
      } else {
        message.error({ key: 'refund-status', content: result.data as string });
      }
    },
    [handleFetch],
  );

  const actionsColumn = useMemo<Column<IRefund>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const statusItems: MenuProps['items'] = statuses.map((s) => ({
          key: `status-${s.id}`,
          label: s.name,
          onClick: () =>
            Modal.confirm({
              title: 'Diqqət',
              content: `Statusu "${s.name}" olaraq dəyişmək istəyirsinizmi?`,
              okText: 'Bəli',
              cancelText: 'Ləğv et',
              onOk: () => updateStatus(original.id, s.id),
            }),
        }));

        const items: MenuProps['items'] = [
          {
            key: 'details',
            label: 'Ətraflı bax',
            icon: <Icons.FileTextOutlined />,
            onClick: () => navigate(`/refunds/${original.id}/info`),
          },
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/refunds/${original.id}/update`, { withBackground: true }),
          },
          {
            key: 'status',
            label: 'Status dəyiş',
            icon: <Icons.AppstoreOutlined />,
            children: statusItems,
          },
          { type: 'divider' },
          {
            key: 'delete',
            label: 'Sil',
            icon: <Icons.DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Diqqət',
                content: 'İadəni silməyə əminsinizmi?',
                okText: 'Sil',
                okType: 'danger',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await RefundsService.delete([original.id]);
                  if (result.status === 200) {
                    handleFetch();
                  } else {
                    message.error(result.data as string);
                  }
                },
              });
            },
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
    [navigate, handleFetch, statuses, updateStatus],
  );

  const printsColumn = useMemo<Column<IRefund>>(
    () => ({
      id: 'prints',
      Header: '',
      sortable: false,
      filterable: false,
      width: 40,
      Cell: ({ row: { original } }: any) => {
        const isEnabled = original.state?.id === 59;
        let bg: string | undefined;
        if (original.state?.id === 58) bg = 'rgb(239 169 169 / 88%)';
        if (original.state?.id === 59) bg = 'rgb(218 223 98)';

        return (
          <StopPropagation>
            <Button icon={<Icons.ProfileOutlined />} size="small" disabled={!isEnabled} style={bg ? { backgroundColor: bg } : undefined} onClick={() => printSticker(original.id)} />
          </StopPropagation>
        );
      },
    }),
    [printSticker],
  );

  const baseColumns = useMemo<Column<IRefund>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { ...nextTableColumns.small, accessor: (r) => r.user?.id, id: 'user_id', Header: 'М.kodu' },
      { ...nextTableColumns.normal, accessor: (r) => r.user?.name, id: 'user_name', Header: 'М.adı' },
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'Trak kod' },
      { ...nextTableColumns.normal, accessor: (r) => r.cargo?.name, id: 'cargo_id', Header: 'Kargo firması', Filter: CargoFilter },
      { accessor: (r) => r.refundNumber, id: 'return_number', Header: 'İadə nömrəsi' },
      { ...nextTableColumns.small, accessor: (r) => r.productType?.name, id: 'product_type_name', Header: 'Kateqoriyası' },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.state?.name,
        id: 'state_id',
        Header: 'Status',
        Filter: StatusFilter,
        Cell: ({ value }: any) => (value ? <Tag color="orange">{value}</Tag> : null),
      },
      { ...nextTableColumns.small, accessor: (r) => r.direction, id: 'direction', Header: 'İstiqamət', Filter: DirectionFilter },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns, printsColumn], [actionsColumn, baseColumns, printsColumn]);
};
