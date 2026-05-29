import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Dropdown, MenuProps, Modal, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { ISortingDeclaration } from '../../interfaces';
import { SortingDeclarationsTableContext } from '../../context';
import { SortingService } from '../../services';

export const useSortingDeclarationsTableColumns = (): Column<ISortingDeclaration>[] => {
  const { id } = useParams<{ id: string }>();
  const { handleFetch } = useContext(SortingDeclarationsTableContext);

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
                  if (result.status === 200) { message.success(result.data.message); handleFetch(); }
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
    [id, handleFetch],
  );

  const baseColumns = useMemo<Column<ISortingDeclaration>[]>(
    () => [
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { ...nextTableColumns.small, accessor: (r) => r.flight.id, id: 'flight_id', Header: 'Uçuş kodu', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.declarationState.name, id: 'declaration_state_id', Header: 'Bağlama statusu', filterable: false },
      { ...nextTableColumns.normal, accessor: (r) => r.sortingState.name, id: 'sorting_state_id', Header: 'Göndəriş statusu', filterable: false },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
