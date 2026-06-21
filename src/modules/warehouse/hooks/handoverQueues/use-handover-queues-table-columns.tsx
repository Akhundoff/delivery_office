import { useContext, useMemo, useState } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Select, message } from 'antd';
import * as Icons from '@ant-design/icons';
import uniqBy from 'lodash/uniqBy';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { MeContext } from '@modules/me';
import { IHandoverQueue } from '../../interfaces';
import { WarehouseService } from '../../services';
import { printHandoverCheck } from '../../utils';

export const useHandoverQueuesTableColumns = (): Column<IHandoverQueue>[] => {
  const me = useContext(MeContext);

  const actionsColumn = useMemo<Column<IHandoverQueue>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const [loading, setLoading] = useState(false);

        const onPrint = async () => {
          setLoading(true);
          const result = await WarehouseService.getHandoverQueue(original.id);
          setLoading(false);
          if (result.status === 200) {
            await printHandoverCheck(me.state.user.data, original.id, result.data);
          } else {
            message.error(result.data as string);
          }
        };

        const items: MenuProps['items'] = [
          {
            key: 'print',
            label: 'Çap et',
            icon: <Icons.PrinterOutlined spin={loading} />,
            disabled: loading,
            onClick: onPrint,
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
    [me.state.user.data],
  );

  return useMemo<Column<IHandoverQueue>[]>(
    () => [
      actionsColumn,
      {
        ...nextTableColumns.small,
        accessor: (row) => row.id,
        id: 'id',
        Header: 'Kod',
      },
      {
        ...nextTableColumns.small,
        accessor: (row) => row.user.id,
        id: 'user_id',
        Header: 'M. kodu',
      },
      {
        accessor: (row) => row.user.fullName,
        id: 'user_name',
        Header: 'M. adı',
      },
      {
        ...nextTableColumns.normal,
        accessor: (row) => row.declarations,
        Header: 'Bağlamalar',
        disableSortBy: true,
        disableFilters: true,
        Cell: ({ cell: { value } }: any) => `${value.length} bağlama`,
      },
      {
        ...nextTableColumns.normal,
        accessor: (row) => row.declarations,
        id: 'boxes',
        Header: 'Yeşiklər',
        disableSortBy: true,
        disableFilters: true,
        Cell: ({ row: { original } }: any) => {
          const boxes = uniqBy(original.declarations.map((d: any) => d.box).filter(Boolean), (b: any) => b.id);
          return <span>{boxes.map((b: any) => b.name).join(', ') || '—'}</span>;
        },
      },
      {
        ...nextTableColumns.normal,
        accessor: (row) => row.status.id,
        id: 'state_id',
        Header: 'Status',
        Filter: ({ column: { setFilter, filterValue } }: any) => (
          <Select style={{ width: '100%' }} allowClear onChange={setFilter} value={filterValue}>
            <Select.Option value="41">Gözləmədə</Select.Option>
            <Select.Option value="42">İcra edilir</Select.Option>
            <Select.Option value="43">Təhvil verilib</Select.Option>
          </Select>
        ),
        Cell: ({ row: { original } }: any) => original.status.name,
      },
      {
        accessor: (row) => row.cashier.fullName,
        id: 'cashier_name',
        Header: 'İcraçı',
      },
      {
        ...nextTableColumns.date,
        accessor: (row) => row.createdAt,
        id: 'created_at',
        Header: 'Yaradılma tarixi',
      },
    ],
    [actionsColumn],
  );
};
