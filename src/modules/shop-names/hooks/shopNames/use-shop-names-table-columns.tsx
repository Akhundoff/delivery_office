import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Select, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { SettingsContext } from '@modules/settings';
import { ShopNamesService } from '../../services';
import { IShopName } from '../../interfaces';
import { ShopNamesTableContext } from '../../context';

export const useShopNamesTableColumns = (): Column<IShopName>[] => {
  const { handleFetch } = useContext(ShopNamesTableContext);
  const navigate = useBackgroundNavigate();
  const settings = useContext(SettingsContext);

  const actionsColumn = useMemo<Column<IShopName>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          { key: 'edit', label: 'Düzəliş et', icon: <Icons.EditOutlined />, onClick: () => navigate(`/shop-names/${original.id}/update`, { withBackground: true }) },
          {
            key: 'delete',
            label: 'Sil',
            icon: <Icons.DeleteOutlined />,
            danger: true,
            onClick: () =>
              Modal.confirm({
                title: 'Mağazanı silməyə əminsinizmi?',
                content: 'Mağazanı təsdiqlədikdən sonra karqoların geri qaytarılması mümkün olmayacaq.',
                okText: 'Sil',
                okType: 'danger',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const r = await ShopNamesService.delete([original.id]);
                  if (r.status === 200) handleFetch();
                  else message.error(r.data as string);
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

  const baseColumns = useMemo<Column<IShopName>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'shop_name', Header: 'Karqo adı' },
      {
        accessor: (r) => r.countryName || '—',
        id: 'country_id',
        Header: 'Ölkə',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {settings.data?.countries.map((c) => (
              <Select.Option key={c.id} value={c.id.toString()}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
    ],
    [settings.data],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
