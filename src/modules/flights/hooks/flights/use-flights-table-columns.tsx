import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, message, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { IFlight } from '../../interfaces';
import { FlightsTableContext } from '../../context';
import { FlightsService } from '../../services';

export const useFlightsTableColumns = (): Column<IFlight>[] => {
  const { handleFetch } = useContext(FlightsTableContext);
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<IFlight>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/flights/${original.id}/update`, { withBackground: true }),
          },
          { type: 'divider' },
          {
            key: 'close',
            label: 'Bağla',
            icon: <Icons.LockOutlined />,
            onClick: () =>
              Modal.confirm({
                title: 'Diqqət',
                content: `"${original.name}" uçuşunu bağlamaq istədiyinizə əminsinizmi?`,
                okText: 'Bağla',
                okType: 'danger',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await FlightsService.close({
                    id: String(original.id),
                    airWaybillNumber: original.airwaybill || '',
                    packagingLimit: '',
                  });
                  if (result.status === 200) {
                    message.success('Uçuş bağlandı.');
                    handleFetch();
                  } else {
                    message.error((result.data as string) || 'Xəta baş verdi.');
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

  const baseColumns = useMemo<Column<IFlight>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
      { accessor: (r) => r.flightProvider || '—', id: 'flight_provider', Header: 'Provayder' },
      { accessor: (r) => r.airwaybill || '—', id: 'airwaybill', Header: 'Airwaybill' },
      { ...nextTableColumns.date, accessor: (r) => r.startedAt, id: 'start_date', Header: 'Başlama tarixi' },
      { ...nextTableColumns.date, accessor: (r) => r.endedAt || '—', id: 'end_date', Header: 'Bitmə tarixi' },
      { accessor: (r) => r.country?.name || '—', id: 'country_id', Header: 'Ölkə' },
      {
        accessor: (r) => r.status?.name || '—',
        id: 'state_id',
        Header: 'Status',
        Cell: ({ value }: any) => <Tag>{value}</Tag>,
      },
      { ...nextTableColumns.small, accessor: (r) => r.count, id: 'count', Header: 'Say', filterable: false },
      {
        ...nextTableColumns.small,
        accessor: (r) => `${r.completedDeclarations}/${r.declarationCount}`,
        id: 'finished',
        Header: 'Tamamlanma',
        filterable: false,
      },
      { ...nextTableColumns.small, accessor: (r) => r.weight, id: 'weight', Header: 'Çəki (kq)', filterable: false },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
