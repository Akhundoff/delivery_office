import React, { useCallback, useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { IFlight } from '../../interfaces';
import { FlightsTableContext } from '../../context';
import { FlightsService } from '../../services';

export const useFlightsTableColumns = (): Column<IFlight>[] => {
  const { handleFetch } = useContext(FlightsTableContext);
  const navigate = useNavigate();
  const backgroundNavigate = useBackgroundNavigate();

  const { data: statusesResult } = useQuery(['statuses-for-flight-columns', 8], () => StatusesService.getList({ per_page: 500, model_id: 8 }));
  const { data: trendyolStatusesResult } = useQuery(['trendyol-statuses-for-flight-columns', 43], () => StatusesService.getList({ per_page: 500, model_id: 43 }));

  const statuses = useMemo(() => (statusesResult?.status === 200 ? statusesResult.data.data : []), [statusesResult]);
  const trendyolStatuses = useMemo(() => (trendyolStatusesResult?.status === 200 ? trendyolStatusesResult.data.data : []), [trendyolStatusesResult]);

  const actionsColumn = useMemo<Column<IFlight>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const downloadFile = useCallback((blob: Blob, filename: string) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        }, []);

        const exportXML = useCallback(
          async (options: { onlyLiquids?: boolean } = {}) => {
            message.loading({ key: 'xml', content: 'Sənəd hazırlanır...', duration: 0 });
            const result = await FlightsService.getXML(original.id, options);
            if (result.status === 200) {
              message.success({ key: 'xml', content: 'Sənəd yüklənir.' });
              downloadFile(result.data as Blob, `flight_${original.id}.xml`);
            } else {
              message.error({ key: 'xml', content: result.data as string });
            }
          },
          [downloadFile, original.id],
        );

        const statusItems: MenuProps['items'] = statuses.map((s) => ({
          key: `status-${s.id}`,
          label: s.name,
          onClick: () =>
            Modal.confirm({
              title: 'Diqqət',
              content: `Statusu "${s.name}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
              onOk: async () => {
                const result = await FlightsService.changeStatus(original.id, s.id);
                if (result.status === 200) { message.success('Status dəyişdirildi'); handleFetch(); }
                else message.error(result.data as string);
              },
            }),
        }));

        const trendyolStatusItems: MenuProps['items'] = trendyolStatuses.map((s) => ({
          key: `trendyol-status-${s.id}`,
          label: s.name,
          onClick: () =>
            Modal.confirm({
              title: 'Diqqət',
              content: `Trendyol statusunu "${s.name}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
              onOk: async () => {
                const result = await FlightsService.changeTrendyolStatus(original.id, s.id);
                if (result.status === 200) { message.success('Status dəyişdirildi'); handleFetch(); }
                else message.error(result.data as string);
              },
            }),
        }));

        const items: MenuProps['items'] = [
          {
            key: 'details',
            label: 'Ətraflı bax',
            icon: <Icons.FileSearchOutlined />,
            onClick: () => navigate(`/flights/${original.id}`),
          },
          { type: 'divider' },
          {
            key: 'airwaybills',
            label: 'Depeşlər',
            icon: <Icons.FieldTimeOutlined />,
            onClick: () => navigate(`/flights/${original.id}/air-waybills`),
          },
          {
            key: 'packages',
            label: 'Bağlanma prosesi',
            icon: <Icons.UnorderedListOutlined />,
            onClick: () => navigate(`/flights/${original.id}/packages`),
          },
          ...(original.trendyol === 1
            ? [
                {
                  key: 'palets',
                  label: 'Paletlər',
                  icon: <Icons.AppstoreOutlined />,
                  onClick: () => navigate(`/flights/${original.id}/palets`),
                } as NonNullable<MenuProps['items']>[number],
              ]
            : []),
          { type: 'divider' as const },
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => backgroundNavigate(`/flights/${original.id}/update`, { withBackground: true }),
          },
          {
            key: 'change-status',
            label: 'Statusu dəyiş',
            icon: <Icons.CheckCircleOutlined />,
            children: statusItems,
          },
          ...(original.trendyol === 1
            ? [
                {
                  key: 'change-trendyol-status',
                  label: 'Trendyol Statusu dəyiş',
                  icon: <Icons.CheckCircleOutlined />,
                  children: trendyolStatusItems,
                } as NonNullable<MenuProps['items']>[number],
              ]
            : []),
          {
            key: 'update-airwaybill',
            label: 'Aviaqaimə nömrəsini dəyiş',
            icon: <Icons.EditOutlined />,
            onClick: () => backgroundNavigate(`/flights/${original.id}/air-waybills/update`, { withBackground: true }),
          },
          {
            key: 'update-current-month',
            label: 'Cari ayı dəyiş',
            icon: <Icons.CalendarOutlined />,
            onClick: () => backgroundNavigate(`/flights/${original.id}/current-month/update`, { withBackground: true }),
          },
          { type: 'divider' as const },
          {
            key: 'manifest',
            label: 'Manifest',
            icon: <Icons.FileExcelOutlined />,
            onClick: async () => {
              message.loading({ key: 'manifest', content: 'Sənəd hazırlanır...', duration: 0 });
              const result = await FlightsService.getExcel(original.id);
              if (result.status === 200) {
                message.success({ key: 'manifest', content: 'Sənəd yüklənir.' });
                const objectURL = URL.createObjectURL(result.data as Blob);
                const a = document.createElement('a');
                a.href = objectURL;
                a.download = `flight_${original.id}_manifest.xls`;
                a.click();
                URL.revokeObjectURL(objectURL);
              } else {
                message.error({ key: 'manifest', content: (result.data as string) || 'Xəta baş verdi.' });
              }
            },
          },
          {
            key: 'upload-manifest',
            label: 'Kisələrlə toplu manifest',
            icon: <Icons.UploadOutlined />,
            onClick: () => backgroundNavigate(`/flights/${original.id}/manifest/upload`, { withBackground: true }),
          },
          {
            key: 'xml-export',
            label: 'XML export',
            icon: <Icons.FileOutlined />,
            children: [
              { key: 'xml-liquids', label: 'Yalnız maye məhsullar', onClick: () => exportXML({ onlyLiquids: true }) },
              { key: 'xml-non-liquids', label: 'Yalnız adi məhsullar', onClick: () => exportXML({ onlyLiquids: false }) },
              { key: 'xml-all', label: 'Bütün məhsullar', onClick: () => exportXML({}) },
            ],
          },
          { type: 'divider' as const },
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
                    type: 'all',
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
    [navigate, backgroundNavigate, handleFetch, statuses, trendyolStatuses],
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
        id: 'finished',
        Header: 'Tamamlanma',
        filterable: false,
        accessor: (r) => r,
        Cell: ({ value: r }: { value: IFlight }) =>
          r.status?.id === 29 ? `${r.declarationCount}` : `${r.completedDeclarations}/${r.declarationCount}`,
      },
      { ...nextTableColumns.small, accessor: (r) => r.weight, id: 'weight', Header: 'Çəki (kq)', filterable: false },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.productPrice,
        id: 'price',
        Header: 'Məbləğ',
        filterable: false,
        Cell: ({ value }: { value: number }) => (value ? `${value.toFixed(2)} ₺` : '—'),
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.deliveryPrice,
        id: 'delivery_price',
        Header: 'Çat. məbləği',
        filterable: false,
        Cell: ({ value }: { value: number }) => (value ? `${value.toFixed(2)} $` : '—'),
      },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
