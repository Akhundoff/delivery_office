import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Dropdown, MenuProps, Modal, Select, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useQuery } from 'react-query';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { StatusesService } from '@modules/statuses/services';
import { ISortingDeclaration } from '../../interfaces';
import { SortingDeclarationsTableContext } from '../../context';
import { SortingService } from '../../services';

export const useSortingDeclarationsTableColumns = (): Column<ISortingDeclaration>[] => {
  const { id } = useParams<{ id: string }>();
  const { handleFetch } = useContext(SortingDeclarationsTableContext);

  const { data: declStatuses } = useQuery(['statuses-for-declarations', 2], () => StatusesService.getList({ per_page: 500, model_id: 2 }), { staleTime: 5 * 60 * 1000 });
  const declStatusList = useMemo(() => (declStatuses?.status === 200 ? declStatuses.data.data : []), [declStatuses]);

  const { data: sortingStatuses } = useQuery(['statuses-for-sorting-decl', 47], () => StatusesService.getList({ per_page: 500, model_id: 47 }), { staleTime: 5 * 60 * 1000 });
  const sortingStatusList = useMemo(() => (sortingStatuses?.status === 200 ? sortingStatuses.data.data : []), [sortingStatuses]);

  const actionsColumn = useMemo<Column<ISortingDeclaration>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'remove',
            label: 'Sil',
            icon: <Icons.DeleteOutlined />,
            danger: true,
            onClick: () =>
              Modal.confirm({
                title: 'Bağlamanı silməyə əminsinizmi?',
                okType: 'danger',
                okText: 'Sil',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await SortingService.removeFromTransfer(Number(id), original.trackCode);
                  if (result.status === 200) {
                    message.success(result.data.message);
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
    [id, handleFetch],
  );

  const baseColumns = useMemo<Column<ISortingDeclaration>[]>(
    () => [
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { ...nextTableColumns.small, accessor: (r) => r.flight.id, id: 'flight_id', Header: 'Uçuş kodu' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.declarationState.name,
        id: 'declaration_state_id',
        Header: 'Bağlama statusu',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select showSearch filterOption={filterOption} allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {declStatusList.map((s) => (
              <Select.Option key={s.id} value={s.id.toString()}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.sortingState.name,
        id: 'sorting_state_id',
        Header: 'Göndəriş statusu',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select showSearch filterOption={filterOption} allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {sortingStatusList.map((s) => (
              <Select.Option key={s.id} value={s.id.toString()}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
    ],
    [declStatusList, sortingStatusList],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
