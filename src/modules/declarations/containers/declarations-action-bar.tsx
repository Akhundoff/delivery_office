import { useCallback, useContext, useMemo } from 'react';
import * as Icons from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, Space, message } from 'antd';
import { CSVLink } from 'react-csv';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate, useMassiveExport } from '@shared/hooks';
import { tableFilterQueryMaker } from '@shared/modules/next-table/utils';
import { MeContext } from '@modules/me';
import { DeclarationsTableContext } from '../context';
import { useDeclarationStatusChange } from '../hooks';
import { printProformaInvoiceForIds } from '../hooks/declarationDetail/use-print';
import { DeclarationsService } from '../services';

export const DeclarationsActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { can } = useContext(MeContext);
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(DeclarationsTableContext);
  const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;
  const selectedIds = useMemo(
    () =>
      Object.entries(state.selectedRowIds)
        .filter(([, value]) => value)
        .map(([rowId]) => rowId),
    [state.selectedRowIds],
  );
  const selectionSummary = useMemo(() => {
    const selected = state.data.filter((d) => state.selectedRowIds[d.id]);
    const usd = selected.reduce((acc, d) => acc + ((d as any).deliveryPrice || 0), 0);
    const azn = Math.round(usd * 1.7 * 100) / 100;
    const weight = selected.reduce((acc, d) => acc + ((d as any).weight || 0), 0);
    return { usd: usd.toFixed(2), azn: azn.toFixed(2), weight: weight.toFixed(2) };
  }, [state.data, state.selectedRowIds]);
  const { freelyStatuses, updateSelectedStatus, bulkUpdateStatus } = useDeclarationStatusChange();
  const { handleExport, exportedData } = useMassiveExport(DeclarationsService.getDeclarations);

  const statusMenuItems = (onSelect: (statusId: number) => void): MenuProps['items'] => freelyStatuses.map((status) => ({ key: status.id, label: status.name, onClick: () => onSelect(status.id) }));

  const handleMassiveExport = useCallback(() => {
    handleExport(tableFilterQueryMaker(state.filters));
  }, [handleExport, state.filters]);

  const openCountsByStatus = useCallback(() => {
    navigate('/statistics/status/declaration-counts', { withBackground: true });
  }, [navigate]);

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'declarations-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await DeclarationsService.getExcel(tableFilterQueryMaker(state.filters));
    if (result.status === 200) {
      message.success({ key: 'declarations-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `declarations_export_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
    } else {
      message.error({ key: 'declarations-export', content: result.data as string });
    }
  }, [state.filters]);

  const exportMiniAsExcel = useCallback(async () => {
    message.loading({ key: 'declarations-export-mini', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await DeclarationsService.getExcelMini(tableFilterQueryMaker(state.filters));
    if (result.status === 200) {
      message.success({ key: 'declarations-export-mini', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `declarations_export_mini_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
    } else {
      message.error({ key: 'declarations-export-mini', content: result.data as string });
    }
  }, [state.filters]);

  const exportWantedAsExcel = useCallback(async () => {
    message.loading({ key: 'declarations-export-wanted', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await DeclarationsService.getWantedExcel();
    if (result.status === 200) {
      message.success({ key: 'declarations-export-wanted', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `wanted_declarations_export_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
    } else {
      message.error({ key: 'declarations-export-wanted', content: result.data as string });
    }
  }, []);

  const combine = useCallback(async () => {
    message.loading({ key: 'declarations-combine', content: 'Bağlamalar birləşdirilir...', duration: 0 });
    const result = await DeclarationsService.combine(selectedIds);
    message.destroy('declarations-combine');
    if (result.status === 200) {
      navigate('/declarations/create', { withBackground: true, state: { combined: { ids: selectedIds, declaration: result.data } } });
    } else {
      message.error(result.data as string);
    }
  }, [navigate, selectedIds]);

  const handoverSelected = useCallback(() => {
    navigate(`/declarations/${selectedIds.join(',')}/handover`, { withBackground: true });
  }, [navigate, selectedIds]);

  const printProformaSelected = useCallback(() => {
    printProformaInvoiceForIds(selectedIds);
  }, [selectedIds]);

  const removeSelected = useCallback(() => {
    Modal.confirm({
      title: 'Diqqət',
      content: 'Bağlamaları silməyə əminsinizmi?',
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'Ləğv et',
      onOk: async () => {
        const result = await DeclarationsService.cancelDeclarations(selectedIds);
        if (result.status === 200) {
          message.success('Bağlamalar silindi.');
          handleFetch();
          handleResetSelection();
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [selectedIds, handleFetch, handleResetSelection]);

  const selectedMenuItems: MenuProps['items'] = [
    {
      key: 'combine',
      label: 'Birləşdir',
      icon: <Icons.SwapOutlined />,
      disabled: selectedIds.length < 2,
      onClick: combine,
    },
    {
      key: 'handover',
      label: 'Təhvil ver',
      icon: <Icons.CheckCircleOutlined />,
      onClick: handoverSelected,
    },
    {
      key: 'proforma',
      label: 'Proforma Print',
      icon: <Icons.PrinterOutlined />,
      onClick: printProformaSelected,
    },
    {
      key: 'delete',
      label: 'Sil',
      icon: <Icons.DeleteOutlined />,
      danger: true,
      disabled: !can('declaration_cancel'),
      onClick: removeSelected,
    },
  ];

  const otherMenuItems: MenuProps['items'] = [
    {
      key: 'export',
      label: 'Export',
      icon: <Icons.FileExcelOutlined />,
      onClick: exportAsExcel,
    },
    {
      key: 'export-mini',
      label: 'Mini Export',
      icon: <Icons.FileExcelOutlined />,
      onClick: exportMiniAsExcel,
    },
    {
      key: 'export-wanted',
      label: 'Axtarışda olanlar',
      icon: <Icons.SearchOutlined />,
      onClick: exportWantedAsExcel,
    },
    {
      key: 'handover-export',
      label: 'Təhvil Excel',
      icon: <Icons.FileExcelOutlined />,
      onClick: () => navigate('/declarations/handover-export', { withBackground: true }),
    },
    {
      key: 'import',
      label: 'Excel Filter',
      icon: <Icons.ImportOutlined />,
      onClick: () => navigate('/declarations/import', { withBackground: true }),
    },
  ];

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={() => navigate('/declarations/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni
          </StyledHeaderButton>
          {!selectionCount ? (
            <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledActionBar.Selection>
              <Icons.CloseCircleTwoTone twoToneColor="#ff4d4f" onClick={handleResetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role="icon" />
              <span>
                {selectionCount} sətir | Çatdırılma: (${selectionSummary.usd} / ₼{selectionSummary.azn}) | Çəki: {selectionSummary.weight}
              </span>
            </StyledActionBar.Selection>
          )}
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'standard', label: 'Standart', onClick: () => navigate('/declarations/acceptance') },
                { key: 'box', label: 'Yeşiklərlə', onClick: () => navigate('/declarations/acceptance/box') },
              ],
            }}
          >
            <StyledHeaderButton type="text" icon={<Icons.LoginOutlined />}>
              Qəbul
            </StyledHeaderButton>
          </Dropdown>
          {can('bulkdeclarationhandover') && (
            <StyledHeaderButton type="text" icon={<Icons.DollarOutlined />} onClick={() => navigate('/declarations/handover')}>
              Toplu təhvil
            </StyledHeaderButton>
          )}
          {selectionCount > 0 ? (
            <Dropdown trigger={['click']} disabled={!freelyStatuses.length} menu={{ items: statusMenuItems(updateSelectedStatus) }}>
              <StyledHeaderButton type="text" icon={<Icons.AppstoreOutlined />}>
                Status dəyiş
              </StyledHeaderButton>
            </Dropdown>
          ) : (
            <Dropdown trigger={['click']} disabled={!freelyStatuses.length} menu={{ items: statusMenuItems(bulkUpdateStatus) }}>
              <StyledHeaderButton type="text" icon={<Icons.AppstoreOutlined />}>
                Toplu status dəyiş
              </StyledHeaderButton>
            </Dropdown>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          <StyledHeaderButton type="text" disabled={true}>
            Cəmi: {state.total}
          </StyledHeaderButton>
        </Space>
        <Space>
          {selectionCount > 0 && can('parcel_state_bulk_change') && (
            <Dropdown trigger={['click']} menu={{ items: selectedMenuItems }}>
              <StyledHeaderButton type="text" icon={<Icons.DownOutlined />}>
                Seçilmişlər
              </StyledHeaderButton>
            </Dropdown>
          )}
          {exportedData.length ? (
            <StyledHeaderButton type="text" icon={<Icons.FileExcelOutlined />}>
              <CSVLink style={{ marginLeft: 8 }} filename={`declarations_list_${Math.round(Math.random() * 1000)}.csv`} data={exportedData as any[]}>
                Yüklə
              </CSVLink>
            </StyledHeaderButton>
          ) : (
            <StyledHeaderButton type="text" onClick={handleMassiveExport} icon={<Icons.FileExcelOutlined />}>
              CSV export
            </StyledHeaderButton>
          )}
          {can('parcel_excel_export') && (
            <Dropdown trigger={['click']} menu={{ items: otherMenuItems }}>
              <StyledHeaderButton type="text" icon={<Icons.DownOutlined />}>
                Digər
              </StyledHeaderButton>
            </Dropdown>
          )}
          <StyledHeaderButton type="text" onClick={openCountsByStatus} icon={<Icons.BarChartOutlined />}>
            Statuslar üzrə say
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
