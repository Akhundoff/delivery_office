import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';

import { CouponsService } from '../../services';
import { ICoupon } from '../../interfaces';
import { CouponsTableContext } from '../../context';

export const useCouponsTableColumns = (): Column<ICoupon>[] => {
  const { handleFetch } = useContext(CouponsTableContext);
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<ICoupon>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const isDeactivated = original.state?.id === 50;
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/coupons/${original.id}/update`, { withBackground: true }),
          },
          { type: 'divider' },
          isDeactivated
            ? {
                key: 'activate',
                label: 'Aktivləşdir',
                icon: <Icons.CheckCircleOutlined />,
                onClick: () => {
                  Modal.confirm({
                    title: 'Kuponun statusunu dəyişməyə əminsinizmi?',
                    okText: 'Bəli',
                    cancelText: 'Xeyr',
                    onOk: async () => {
                      const result = await CouponsService.changeStatus(original.id, 49);
                      if (result.status === 200) {
                        handleFetch();
                      } else {
                        message.error(result.data as string);
                      }
                    },
                  });
                },
              }
            : {
                key: 'deactivate',
                label: 'Deaktivləşdir',
                icon: <Icons.CloseCircleOutlined />,
                onClick: () => {
                  Modal.confirm({
                    title: 'Kuponun statusunu dəyişməyə əminsinizmi?',
                    okText: 'Bəli',
                    cancelText: 'Xeyr',
                    onOk: async () => {
                      const result = await CouponsService.changeStatus(original.id, 50);
                      if (result.status === 200) {
                        handleFetch();
                      } else {
                        message.error(result.data as string);
                      }
                    },
                  });
                },
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

  const baseColumns = useMemo<Column<ICoupon>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
      { accessor: (r) => r.tag, id: 'tag', Header: 'Teq' },
      { accessor: (r) => `${r.amount} ${r.currency}`, id: 'amount', Header: 'Məbləğ' },
      { accessor: (r) => r.count, id: 'count', Header: 'Limit' },
      { accessor: (r) => r.country?.name, id: 'country_name', Header: 'Ölkə' },
      {
        accessor: (r) => r.state?.name,
        id: 'state_name',
        Header: 'Status',
        Cell: ({ value }: any) => (value ? <Tag color="blue">{value}</Tag> : null),
      },
      {
        ...nextTableColumns.date,
        accessor: (r) => r.createdAt,
        id: 'created_at',
        Header: 'Tarix',
      },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
