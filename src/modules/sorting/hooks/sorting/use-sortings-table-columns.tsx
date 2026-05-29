import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { ISorting } from '../../interfaces';
import { SortingsTableContext } from '../../context';
import { SortingService } from '../../services';

export const useSortingsTableColumns = (): Column<ISorting>[] => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(SortingsTableContext);

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
            onClick: () =>
              Modal.confirm({
                title: 'AzəriExpress-ə göndərilsin?',
                onOk: async () => {
                  const result = await SortingService.send(original.id);
                  if (result.status === 200) { message.success(result.data as string); handleFetch(); }
                  else message.error(result.data as string);
                },
              }),
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
                  if (result.status === 200) { message.success(result.data as string); handleFetch(); }
                  else message.error(result.data as string);
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

  const baseColumns = useMemo<Column<ISorting>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.branchName, id: 'branch_id', Header: 'Filial' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.state.name,
        id: 'state_id',
        Header: 'Status',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag>{original.state.name}</Tag>,
      },
      { ...nextTableColumns.normal, accessor: (r) => r.parcel.must, id: 'parcel_must', Header: 'Uçuşa görə say', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.parcel.count, id: 'parcel_count', Header: 'Faktiki say', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.parcel.lack, id: 'parcel_lack', Header: 'Çatışmayan say', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.accepted, id: 'accepted', Header: 'Filial qəbul edib', filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
