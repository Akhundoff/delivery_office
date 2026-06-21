import { useCallback, useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Dropdown, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { BannersService } from '../../services';
import { bannerTypes } from '../../constants/banner-types';
import { IBanner } from '../../interfaces';
import { BannersTableContext } from '../../context';

export const useBannersTableColumns = (): Column<IBanner>[] => {
  const { handleFetch } = useContext(BannersTableContext);
  const navigate = useBackgroundNavigate();

  const handleDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: 'Banneri silməyə əminsinizmi?',
        content: 'Banneri təsdiqlədikdən sonra bannerin geri qaytarılması mümkün olmayacaq.',
        okText: 'Sil',
        cancelText: 'Ləğv et',
        okButtonProps: { danger: true },
        onOk: async () => {
          const result = await BannersService.delete([id]);
          if (result.status === 200) {
            handleFetch();
          } else {
            message.error(result.data as string);
          }
        },
      });
    },
    [handleFetch],
  );

  const handleActivate = useCallback(
    async (id: number, active: boolean) => {
      const result = await BannersService.activate(id, active);
      if (result.status === 200) {
        handleFetch();
      } else {
        message.error(result.data as string);
      }
    },
    [handleFetch],
  );

  return useMemo<Column<IBanner>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        id: 'actions',
        Header: '',
        Cell: ({ row }: any) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'activate',
                  label: row.original.active ? 'Deaktiv et' : 'Aktivləşdir',
                  icon: <Icons.EditOutlined />,
                  onClick: () => handleActivate(row.original.id, !row.original.active),
                },
                {
                  key: 'edit',
                  label: 'Düzəlt',
                  icon: <Icons.EditOutlined />,
                  onClick: () => navigate(`/banners/${row.original.id}/update`, { withBackground: true }),
                },
                {
                  key: 'delete',
                  label: 'Sil',
                  icon: <Icons.DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(row.original.id),
                },
              ],
            }}
          >
            <Icons.MoreOutlined />
          </Dropdown>
        ),
      },
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      {
        ...nextTableColumns.large,
        accessor: (r) => r.documentFile,
        id: 'document_file',
        Header: 'Şəkil',
        Cell: ({ value }: any) =>
          value ? (
            <a target="_blank" rel="noreferrer" href={value}>
              Görüntülə
            </a>
          ) : null,
      },
      { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.type,
        id: 'type',
        Header: 'Yer',
        Cell: ({ value }: any) => {
          const bt = bannerTypes.find((t) => t.type === value);
          return bt ? <Tag>{bt.title}</Tag> : value;
        },
      },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
      {
        ...nextTableColumns.normal,
        accessor: (r) => r.active,
        id: 'active',
        Header: 'Aktivdir',
        Cell: ({ value }: any) => <Tag color={value ? 'green' : 'red'}>{value ? 'Aktiv' : 'Aktiv deyil'}</Tag>,
      },
    ],
    [navigate, handleDelete, handleActivate],
  );
};
