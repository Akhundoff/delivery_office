import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Select, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/az';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { useBranches } from '@modules/branches';
import { SettingsContext } from '@modules/settings';
import { ICustomsTask } from '../../interfaces';

dayjs.extend(relativeTime);

const BranchFilter = ({ column: { filterValue, setFilter } }: any) => {
  const branches = useBranches();
  return (
    <Select value={filterValue} onChange={(v) => setFilter(v)} allowClear placeholder="Filial seçin..." loading={branches.isLoading} style={{ width: '100%' }} size="small">
      {(branches.data || []).map((b) => (
        <Select.Option key={b.id} value={b.id}>
          {b.name}
        </Select.Option>
      ))}
    </Select>
  );
};

const CountryFilter = ({ column: { filterValue, setFilter } }: any) => {
  const settings = useContext(SettingsContext);
  return (
    <Select value={filterValue} onChange={(v) => setFilter(v)} allowClear placeholder="Ölkə seçin..." style={{ width: '100%' }} size="small">
      {(settings.data?.countries || []).map((c) => (
        <Select.Option key={c.id} value={c.id}>
          {c.name}
        </Select.Option>
      ))}
    </Select>
  );
};

const TaskStatusFilter = ({ column: { filterValue, setFilter } }: any) => (
  <Select value={filterValue} onChange={(v) => setFilter(v)} allowClear placeholder="Status seçin..." style={{ width: '100%' }} size="small">
    <Select.Option value={37}>Təsdiq gözləyir</Select.Option>
    <Select.Option value={38}>İcra edilib</Select.Option>
  </Select>
);

export const useCustomsTasksTableColumns = (): Column<ICustomsTask>[] => {
  const navigate = useBackgroundNavigate();

  return useMemo<Column<ICustomsTask>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        Cell: ({ row: { original } }: any) => (
          <StopPropagation>
            <Button icon={<Icons.FileSearchOutlined />} size="small" onClick={() => navigate(`/customs/tasks/${original.id}`, { withBackground: true })} />
          </StopPropagation>
        ),
      },
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { ...nextTableColumns.small, accessor: (r) => r.declaration.user.id, id: 'user_id', Header: 'M. kodu' },
      { ...nextTableColumns.large, accessor: (r) => r.declaration.user.name, id: 'user_name', Header: 'Müştəri' },
      { ...nextTableColumns.normal, accessor: (r) => r.branch.name, id: 'branch_id', Header: 'Filial', Filter: BranchFilter },
      { ...nextTableColumns.small, accessor: (r) => r.declaration.country?.name, id: 'country_id', Header: 'Ölkə', Filter: CountryFilter },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.declaration.trackCode,
        id: 'track_code',
        Header: 'İzləmə kodu',
        Cell: ({ cell: { value } }: any) => <Tag>{value}</Tag>,
      },
      { ...nextTableColumns.large, accessor: (r) => r.declaration.updatedBy?.name, id: 'changer_id', Header: 'Anbara əlavə edən' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.createdAt,
        id: 'created_at_humanized',
        Header: 'Yəni əlavə olunma',
        filterable: false,
        sortable: false,
        Cell: ({ cell: { value } }: any) => (value ? dayjs(value).locale('az').fromNow() : ''),
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.declaration.weight,
        id: 'weight',
        Header: 'Çəkisi',
        Cell: ({ cell: { value } }: any) => (value != null ? `${Number(value).toFixed(2)} kq` : ''),
      },
      { ...nextTableColumns.normal, accessor: (r) => r.declaration.basket?.name, id: 'basket_id', Header: 'Səbət' },
      { ...nextTableColumns.smaller, accessor: (r) => r.declaration.quantity, id: 'quantity', Header: 'Miqdar' },
      { ...nextTableColumns.normal, accessor: (r) => r.declaration.status.name, id: 'declaration_state_name', Header: 'Bağ. status' },
      { ...nextTableColumns.normal, accessor: (r) => r.declaration.productType.name, id: 'product_type_id', Header: 'Məhsul tipi' },
      { ...nextTableColumns.small, accessor: (r) => r.action, id: 'action', Header: 'Top' },
      { ...nextTableColumns.normal, accessor: (r) => r.status.name, id: 'state_id', Header: 'Task statusu', Filter: TaskStatusFilter },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
    ],
    [navigate],
  );
};
