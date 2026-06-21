import React, { useCallback, useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Select, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { SettingsContext } from '@modules/settings';
import { printFlightWaybill } from '@modules/declarations/hooks';
import { IFlight } from '../../interfaces';
import { FlightsTableContext } from '../../context';
import { FlightsService } from '../../services';
import { FlightCountsCell } from '../../components/flight-counts-cell';
import { FlightDimensionalWeightCell } from '../../components/flight-dimensional-weight-cell';

export const useFlightsTableColumns = (): Column<IFlight>[] => {
  const { handleFetch } = useContext(FlightsTableContext);
  const navigate = useNavigate();
  const backgroundNavigate = useBackgroundNavigate();
  const settings = useContext(SettingsContext);

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
          async (options: { onlyLiquids?: boolean; partnerId?: number } = {}) => {
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

        const exportManifest = useCallback(
          async (partnerId?: number) => {
            message.loading({ key: 'manifest', content: 'Sənəd hazırlanır...', duration: 0 });
            const result = await FlightsService.getExcel(original.id);
            if (result.status === 200) {
              message.success({ key: 'manifest', content: 'Sənəd yüklənir.' });
              downloadFile(result.data as Blob, `flight_${original.id}_manifest.xls`);
            } else {
              message.error({ key: 'manifest', content: result.data as string });
            }
          },
          [downloadFile, original.id],
        );

        const exportManifestByParcels = useCallback(async () => {
          message.loading({ key: 'manifest-box', content: 'Yüklənir...', duration: 0 });
          const result = await FlightsService.getManifestByParcel(original.id);
          message.destroy('manifest-box');
          if (result.status === 200) {
            window.open(result.data.file, '_blank');
          } else {
            message.error(result.data as string);
          }
        }, [original.id]);

        const statusItems: MenuProps['items'] = statuses.map((s) => ({
          key: `status-${s.id}`,
          label: s.name,
          onClick: () =>
            Modal.confirm({
              title: 'Diqqət',
              content: `Statusu "${s.name}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
              onOk: async () => {
                const result = await FlightsService.changeStatus(original.id, s.id);
                if (result.status === 200) {
                  message.success('Status dəyişdirildi');
                  handleFetch();
                } else message.error(result.data as string);
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
                if (result.status === 200) {
                  message.success('Status dəyişdirildi');
                  handleFetch();
                } else message.error(result.data as string);
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
          {
            key: 'declarations',
            label: 'Bağlamalar',
            icon: <Icons.OrderedListOutlined />,
            onClick: () => navigate(`/flights/${original.id}/declarations`),
          },
          {
            key: 'non-sorted',
            label: 'Çeşidlənməmiş Bağlamalar',
            icon: <Icons.SortDescendingOutlined />,
            onClick: () => navigate(`/sorting/${original.id}/non-sorted-declarations`),
          },
          {
            key: 'packages',
            label: 'Bağlanma prosesi',
            icon: <Icons.UnorderedListOutlined />,
            onClick: () => navigate(`/flights/${original.id}/packages`),
          },
          {
            key: 'airwaybills',
            label: 'Göndərilən depeşlər',
            icon: <Icons.FieldTimeOutlined />,
            onClick: () => navigate(`/flights/${original.id}/air-waybills`),
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
            disabled: original.status.id !== 30,
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
            onClick: () => exportManifest(),
          },
          {
            key: 'upload-manifest',
            label: 'Kisələrlə toplu manifest (Excel ilə)',
            icon: <Icons.UploadOutlined />,
            onClick: () => backgroundNavigate(`/flights/${original.id}/manifest/upload`, { withBackground: true }),
          },
          {
            key: 'manifest-by-parcels',
            label: 'Kisələrlə toplu manifest',
            icon: <Icons.FileExcelOutlined />,
            onClick: exportManifestByParcels,
          },
          {
            key: 'waybill',
            label: 'Yol vərəqəsi',
            icon: <Icons.PrinterOutlined />,
            onClick: () => printFlightWaybill({ flightId: original.id }),
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
          {
            key: 'modafun',
            label: 'Modafun',
            icon: <Icons.ControlOutlined />,
            children: [
              { key: 'modafun-manifest', label: 'Manifest', icon: <Icons.FileExcelOutlined />, onClick: () => exportManifest(1) },
              { key: 'modafun-waybill', label: 'Yol vərəqəsi', icon: <Icons.PrinterOutlined />, onClick: () => printFlightWaybill({ flightId: original.id, partnerId: 1 }) },
              {
                key: 'modafun-xml',
                label: 'XML export',
                icon: <Icons.FileOutlined />,
                children: [
                  { key: 'modafun-xml-liquids', label: 'Yalnız maye məhsullar', onClick: () => exportXML({ onlyLiquids: true, partnerId: 1 }) },
                  { key: 'modafun-xml-non-liquids', label: 'Yalnız adi məhsullar', onClick: () => exportXML({ onlyLiquids: false, partnerId: 1 }) },
                  { key: 'modafun-xml-all', label: 'Bütün məhsullar', onClick: () => exportXML({ partnerId: 1 }) },
                ],
              },
            ],
          },
          { type: 'divider' as const },
          {
            key: 'close',
            label: 'Uçuşu bağla',
            icon: <Icons.LockOutlined />,
            disabled: original.status.id !== 29,
            children: [
              { key: 'close-with-dispatch', label: 'Depeşli', onClick: () => navigate(`/flights/${original.id}/close/with-dispatch`) },
              { key: 'close-without-dispatch', label: 'Depeşsiz', onClick: () => navigate(`/flights/${original.id}/close/without-dispatch`) },
              { key: 'close-all', label: 'Hamısı', onClick: () => navigate(`/flights/${original.id}/close/all`) },
            ],
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
    [navigate, backgroundNavigate, handleFetch, statuses, trendyolStatuses],
  );

  const baseColumns = useMemo<Column<IFlight>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.flightProvider || '—',
        id: 'flight_provider',
        Header: 'Provayder',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            <Select.Option value="0">Daxili</Select.Option>
            <Select.Option value="1">Trendyol</Select.Option>
            <Select.Option value="2">Temu</Select.Option>
          </Select>
        ),
      },
      { accessor: (r) => r.airwaybill || '—', id: 'airwaybill', Header: 'Airwaybill' },
      { ...nextTableColumns.date, accessor: (r) => r.startedAt, id: 'start_date', Header: 'Başlanğıc tarixi' },
      { ...nextTableColumns.date, accessor: (r) => r.endedAt || '—', id: 'end_date', Header: 'Bitmə tarixi' },
      {
        accessor: (r) => r.country?.name || '—',
        id: 'country_id',
        Header: 'Ölkə',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {(settings.data?.countries || []).map((c) => (
              <Select.Option key={c.id} value={c.id.toString()}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        accessor: (r) => r.status?.name || '—',
        id: 'state_id',
        Header: 'Status',
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <Select allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
            {statuses.map((s) => (
              <Select.Option key={s.id} value={s.id.toString()}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        ),
        Cell: ({ value }: any) => <Tag>{value}</Tag>,
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.count,
        id: 'count',
        Header: 'Bağlama sayı',
        filterable: false,
        Cell: FlightCountsCell,
      },
      {
        ...nextTableColumns.small,
        id: 'finished',
        Header: 'Tamamlanma',
        filterable: false,
        accessor: (r) => r,
        Cell: ({ value: r }: { value: IFlight }) => (r.status?.id === 29 ? `${r.declarationCount}` : `${r.completedDeclarations}/${r.declarationCount}`),
      },
      { ...nextTableColumns.small, accessor: (r) => r.weight, id: 'weight', Header: 'Çəki (kq)', filterable: false },
      {
        ...nextTableColumns.small,
        id: 'dimensional_weight',
        Header: 'Həcmi çəki',
        filterable: false,
        accessor: (r) => r,
        Cell: FlightDimensionalWeightCell,
      },
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
    [settings.data?.countries, statuses],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
