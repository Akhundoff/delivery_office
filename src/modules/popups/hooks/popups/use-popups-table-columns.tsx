import { useCallback, useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Dropdown, Modal, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { PopupsService } from '../../services';
import { IPopup, PopupTarget, PopupType } from '../../interfaces';
import { PopupsTableContext } from '../../context';

const targetLabel: Record<PopupTarget, string> = {
  [PopupTarget.MOBILE]: 'Mobil',
  [PopupTarget.WEBSITE]: 'Veb',
  [PopupTarget.BOTH]: 'Hər ikisi',
};

const typeColor: Record<PopupType, string> = {
  [PopupType.STANDART]: 'default',
  [PopupType.SUCCESS]: 'green',
  [PopupType.WARNING]: 'orange',
};

export const usePopupsTableColumns = (): Column<IPopup>[] => {
  const { handleFetch } = useContext(PopupsTableContext);
  const navigate = useBackgroundNavigate();

  const handleDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: 'Silmək istədiyinizə əminsiniz?',
        okText: 'Sil',
        cancelText: 'Ləğv et',
        okButtonProps: { danger: true },
        onOk: async () => {
          await PopupsService.delete([id]);
          handleFetch();
        },
      });
    },
    [handleFetch],
  );

  return useMemo<Column<IPopup>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.title, id: 'title', Header: 'Başlıq' },
      { accessor: (r) => r.message, id: 'message', Header: 'Mətn' },
      { accessor: (r) => r.buttonName, id: 'button_name', Header: 'Link adı' },
      { accessor: (r) => r.buttonLink, id: 'button_link', Header: 'Link' },
      { accessor: (r) => r.buttonLinkMobile, id: 'button_link_mobile', Header: 'Mobil düymə linki' },
      {
        accessor: (r) => r.target,
        id: 'target',
        Header: 'Hədəf',
        Cell: ({ value }: any) => <Tag>{targetLabel[value as PopupTarget] ?? value}</Tag>,
      },
      {
        accessor: (r) => r.type,
        id: 'type',
        Header: 'Tip',
        Cell: ({ value }: any) => <Tag color={typeColor[value as PopupType]}>{value}</Tag>,
      },
      { ...nextTableColumns.date, accessor: (r) => r.startDate, id: 'start_date', Header: 'Başlanğıc' },
      { ...nextTableColumns.date, accessor: (r) => r.endDate, id: 'end_date', Header: 'Bitmə' },
      { ...nextTableColumns.small, accessor: (r) => r.maxShowCount, id: 'max_show_count', Header: 'Max göstərilmə' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
      {
        ...nextTableColumns.actions,
        id: 'actions',
        Header: '',
        Cell: ({ row }: any) => (
          <Dropdown
            menu={{
              items: [
                { key: 'edit', label: 'Düzəlt', icon: <Icons.EditOutlined />, onClick: () => navigate(`/popups/${row.original.id}/update`, { withBackground: true }) },
                { key: 'delete', label: 'Sil', icon: <Icons.DeleteOutlined />, danger: true, onClick: () => handleDelete(row.original.id) },
              ],
            }}
          >
            <Icons.MoreOutlined />
          </Dropdown>
        ),
      },
    ],
    [navigate, handleDelete],
  );
};
