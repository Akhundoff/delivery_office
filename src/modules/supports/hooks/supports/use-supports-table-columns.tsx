import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useQuery } from 'react-query';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { ISupport } from '../../interfaces';
import { SupportsTableContext } from '../../context';
import { SupportsService } from '../../services';

export const useSupportsTableColumns = (): Column<ISupport>[] => {
  const { handleFetch } = useContext(SupportsTableContext);
  const navigate = useBackgroundNavigate();

  const { data: statusesResult } = useQuery(['statuses-for-supports', 9], () => StatusesService.getList({ per_page: 500, model_id: 9 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const actionsColumn = useMemo<Column<ISupport>>(
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
                const result = await SupportsService.changeStatus([original.id], s.id);
                if (result.status === 200) { message.success('Status dəyişdirildi.'); handleFetch(); }
                else message.error(result.data as string);
              },
            }),
        }));

        const items: MenuProps['items'] = [
          { key: 'open', label: 'Bax', icon: <Icons.MessageOutlined />, onClick: () => navigate(`/supports/${original.id}`) },
          {
            key: 'toggle-read',
            label: original.read ? 'Oxunmamış et' : 'Oxunmuş et',
            icon: <Icons.ReadOutlined />,
            onClick: async () => {
              const result = await SupportsService.toggleRead([original.id], original.read);
              if (result.status === 200) handleFetch();
              else message.error(result.data as string);
            },
          },
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
                content: 'Müraciəti silməyə əminsinizmi?',
                okType: 'danger',
                okText: 'Sil',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await SupportsService.cancel([original.id]);
                  if (result.status === 200) { message.success('Müraciət silindi.'); handleFetch(); }
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
    [handleFetch, statuses, navigate],
  );

  const baseColumns = useMemo<Column<ISupport>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'ID', id: 'id', accessor: (r) => r.id },
      { ...nextTableColumns.small, Header: 'M. kodu', id: 'user_id', accessor: (r) => r.client.id },
      { accessor: (r) => r.client.name, id: 'user_name', Header: 'Müştəri' },
      { ...nextTableColumns.normal, accessor: (r) => r.category.name, id: 'ticket_category_id', Header: 'Kateqoriya' },
      { ...nextTableColumns.normal, accessor: (r) => r.executor?.name || '—', id: 'executor', Header: 'İcraçı', filterable: false },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.status.name,
        id: 'state_id',
        Header: 'Status',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag>{original.status.name}</Tag>,
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.counts.new,
        id: 'new_messages',
        Header: 'Yeni',
        filterable: false,
        Cell: ({ row: { original } }: any) =>
          original.counts.new > 0 ? <Tag color='red'>{original.counts.new}</Tag> : <span>{original.counts.new}</span>,
      },
      { ...nextTableColumns.small, accessor: (r) => r.counts.all, id: 'all_messages', Header: 'Cəmi', filterable: false },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.read,
        id: 'is_new_admin',
        Header: 'Oxunub',
        filterable: false,
        Cell: ({ row: { original } }: any) => <Tag color={original.read ? 'green' : 'default'}>{original.read ? 'Bəli' : 'Xeyr'}</Tag>,
      },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
