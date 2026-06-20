import React, { useCallback, useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Select, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import * as handlebars from 'handlebars';
import dayjs from 'dayjs';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { useBackgroundNavigate } from '@shared/hooks';
import { MeContext } from '@modules/me';
import { useBranches } from '@modules/branches';
import { StatusesService } from '@modules/statuses/services';
import { useQuery } from 'react-query';
import { ISorting } from '../../interfaces';
import { SortingsTableContext } from '../../context';
import { SortingService } from '../../services';
import { checkTemplate } from '../../templates';

export const useSortingsTableColumns = (): Column<ISorting>[] => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(SortingsTableContext);
  const { can } = useContext(MeContext);
  const branches = useBranches();
  const { data: statuses } = useQuery(['statuses-for-sorting', 46], () => StatusesService.getList({ per_page: 500, model_id: 46 }), { staleTime: 5 * 60 * 1000 });
  const statusList = useMemo(() => (statuses?.status === 200 ? statuses.data.data : []), [statuses]);

  const printSortingCheck = useCallback(async (id: number) => {
    message.loading({ content: 'Çek hazırlanır.', key: 'print-check' });
    try {
      const templateText = await fetch(checkTemplate).then((r) => r.text());
      const result = await SortingService.getTransferInfo(id);
      message.destroy('print-check');
      if (result.status === 200) {
        const html = handlebars.compile(templateText)({ data: result.data, checkDate: dayjs().format('DD.MM.YYYY') });
        const printWindow = window.open();
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
        } else message.error('Brauzerdə xəta baş verdi.');
      } else {
        message.error(result.data as string);
      }
    } catch {
      message.error('Şablon əldə edilə bilmədi.');
    }
  }, []);

  const actionsColumn = useMemo<Column<ISorting>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          { key: 'details', label: 'Ətraflı bax', icon: <Icons.FileSearchOutlined />, onClick: () => navigate(`/sorting/${original.id}`) },
          {
            key: 'azeriexpress',
            label: 'AzəriExpress-ə göndər',
            icon: <Icons.TransactionOutlined />,
            disabled: original.isSendAzeriexpress,
            onClick: () => navigate(`/sorting/${original.id}/send`, { withBackground: true }),
          },
          {
            key: 'flyex',
            label: 'Flyex-ə göndər',
            icon: <Icons.TransactionOutlined />,
            onClick: () =>
              Modal.confirm({
                title: 'Flyex-ə göndərilsin?',
                onOk: async () => {
                  const result = await SortingService.transferToFlyex(original.id);
                  if (result.status === 200) {
                    message.success(result.data as string);
                    handleFetch();
                  } else message.error(result.data as string);
                },
              }),
          },
          ...(can('parcel_sorting_create') ? [{ key: 'edit', label: 'Düzəliş et', icon: <Icons.EditOutlined />, onClick: () => navigate('/sorting/acceptance', { state: { id: original.id } }) }] : []),
          { key: 'print', label: 'Etiket çap et', icon: <Icons.PrinterOutlined />, onClick: () => printSortingCheck(original.id) },
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
    [navigate, handleFetch, can, printSortingCheck],
  );

  const baseColumns = useMemo<Column<ISorting>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      {
        accessor: (r) => r.branchName,
        id: 'branch_id',
        Header: 'Filial',
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
        accessor: (r) => r.state.name,
        id: 'state_id',
        Header: 'Status',
        Cell: ({ row: { original } }: any) => <Tag>{original.state.name}</Tag>,
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {statusList.map((s) => (
              <Select.Option key={s.id} value={s.id.toString()}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      { ...nextTableColumns.normal, accessor: (r) => r.parcel.must, id: 'parcel_must', Header: 'Uçuşa görə say', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.parcel.count, id: 'parcel_count', Header: 'Faktiki say', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.parcel.lack, id: 'parcel_lack', Header: 'Çatışmayan say', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.accepted, id: 'accepted', Header: 'Filial qəbul edib', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
    ],
    [branches.data, statusList],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
