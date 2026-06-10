import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Select, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { NextTableCheckboxFilter } from '@shared/modules/next-table/components/filters/checkbox';
import { OverCell, TagCell } from '@shared/components/cells';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { usePartners } from '@modules/partners';
import { IPartnerDeclaration } from '../../interfaces';
import { DeclarationsService } from '../../services';
import { PartnerDeclarationsTableContext } from '../../context';

export const usePartnerDeclarationsTableColumns = (): Column<IPartnerDeclaration>[] => {
  const { handleFetch } = useContext(PartnerDeclarationsTableContext);
  const navigate = useBackgroundNavigate();
  const partners = usePartners();

  const actionsColumn = useMemo<Column<IPartnerDeclaration>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'details',
            label: 'Ətraflı bax',
            icon: <Icons.FileSearchOutlined />,
            onClick: () => navigate(`/declarations/${original.id}`),
          },
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/declarations/${original.id}/update`, { withBackground: true }),
          },
          { type: 'divider' },
          {
            key: 'delete',
            label: 'Sil',
            icon: <Icons.DeleteOutlined />,
            danger: true,
            onClick: () =>
              Modal.confirm({
                title: 'Bəyannaməni sil',
                content: 'Bu əməliyyat geri alına bilməz. Davam etmək istəyirsiniz?',
                okText: 'Sil',
                okType: 'danger',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await DeclarationsService.cancelDeclarations([original.id]);
                  if (result.status === 200) {
                    message.success('Bəyannamə silindi');
                    handleFetch();
                  } else {
                    message.error(result.data as string);
                  }
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
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<IPartnerDeclaration>[]>(
    () => [
      {
        ...nextTableColumns.small,
        accessor: (row) => row.user.id,
        id: 'user_id',
        Header: 'M. kodu',
      },
      {
        accessor: (row) => row.user.name,
        id: 'user_name',
        Header: 'Müştəri',
        Cell: OverCell,
      },
      {
        accessor: (row) => row.partner.name,
        id: 'partner_id',
        Header: 'Partnyor',
        Cell: OverCell,
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {partners.data?.map((partner) => (
              <Select.Option key={partner.id} value={partner.id}>
                {partner.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        ...nextTableColumns.smaller,
        accessor: (row) => row.trackCode,
        id: 'track_code',
        Header: 'İzləmə kodu',
        Cell: ({ cell: { value }, row: { original } }: any) => (
          <Tag color={!original.read ? 'green' : 'default'}>{value}</Tag>
        ),
      },
      {
        ...nextTableColumns.normal,
        accessor: (row) => row.globalTrackCode,
        id: 'global_track_code',
        Header: 'Q.İ kodu',
        Cell: TagCell,
      },
      {
        ...nextTableColumns.normal,
        accessor: (row) => row.status.name,
        id: 'state_id',
        Header: 'Status',
        Cell: OverCell,
      },
      {
        ...nextTableColumns.smaller,
        accessor: (row) => row.approved,
        id: 'customs',
        Header: 'Bəyan',
        Filter: NextTableCheckboxFilter,
        Cell: ({ cell: { value } }: any) =>
          value ? <Icons.CheckOutlined style={{ color: '#52c41a' }} /> : <Icons.CloseOutlined style={{ color: '#ff4d4f' }} />,
      },
      {
        ...nextTableColumns.smaller,
        accessor: (row) => row.paid,
        id: 'payed',
        Header: 'Ödəniş',
        Filter: NextTableCheckboxFilter,
        Cell: ({ cell: { value } }: any) =>
          value ? <Icons.CheckOutlined style={{ color: '#52c41a' }} /> : <Icons.CloseOutlined style={{ color: '#ff4d4f' }} />,
      },
      {
        ...nextTableColumns.normal,
        accessor: (row) => row.flight?.name,
        id: 'flight_name',
        Header: 'Uçuş',
        Cell: OverCell,
      },
      {
        ...nextTableColumns.small,
        accessor: (row) => row.price,
        id: 'price',
        Header: 'Məhsulun qiyməti',
        Cell: ({ cell: { value } }: any) => (value != null ? `${Number(value).toFixed(2)}` : '—'),
      },
      {
        ...nextTableColumns.small,
        accessor: (row) => row.deliveryPrice,
        id: 'delivery_price',
        Header: 'Çatdırılma qiyməti',
        Cell: ({ cell: { value } }: any) => (value != null ? `${Number(value).toFixed(2)} $` : '—'),
      },
      {
        ...nextTableColumns.smaller,
        accessor: (row) => row.quantity,
        id: 'quantity',
        Header: 'Say',
      },
      {
        ...nextTableColumns.small,
        accessor: (row) => row.weight,
        id: 'weight',
        Header: 'Çəki',
        Cell: ({ cell: { value } }: any) => (value != null ? `${Number(value).toFixed(2)} kq` : '—'),
      },
      {
        ...nextTableColumns.small,
        accessor: (row) => row.type,
        id: 'type',
        Header: 'Tərkib',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            <Select.Option value='1'>Maye</Select.Option>
            <Select.Option value='2'>Digər</Select.Option>
          </Select>
        ),
        Cell: ({ cell: { value } }: any) => (value === 'liquid' ? 'Maye' : 'Digər'),
      },
      {
        ...nextTableColumns.normal,
        accessor: (row) => row.productType?.name,
        id: 'product_type_id',
        Header: 'Məhsulun tipi',
        Cell: OverCell,
      },
      {
        ...nextTableColumns.small,
        accessor: (row) => row.parcel?.id,
        id: 'basket_id',
        Header: 'Koli',
      },
      {
        ...nextTableColumns.normal,
        accessor: (row) => row.box?.name,
        id: 'container_id',
        Header: 'Yeşik',
        Cell: OverCell,
      },
      {
        ...nextTableColumns.small,
        accessor: (row) => row.branch?.name,
        id: 'branch_id',
        Header: 'Filial',
        Cell: OverCell,
      },
      {
        ...nextTableColumns.date,
        accessor: (row) => row.createdAt,
        id: 'created_at',
        Header: 'Yaradılma tarixi',
      },
    ],
    [partners.data],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
