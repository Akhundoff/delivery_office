import { useCallback, useContext, useState } from 'react';
import { DatePicker, Dropdown, Modal, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs from 'dayjs';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { MeContext } from '@modules/me/context/context';
import { LogsTableContext } from '../context';
import { LogsService } from '../services';

export const LogsActionBar = () => {
  const { handleFetch, handleReset, handleSelectAll, handleResetSelection, state } = useContext(LogsTableContext);
  const { can } = useContext(MeContext);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [exporting, setExporting] = useState(false);

  const selectionCount = Object.keys(state.selectedRowIds).length;
  const hasFilters = state.filters.length > 0;

  const handleExportAsExcel = useCallback(async () => {
    message.loading({ key: 'logs-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const query = Object.fromEntries(state.filters.map((f) => [f.id, f.value]));
    const result = await LogsService.exportAsExcel(query);
    if (result.status === 200) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_export_${Date.now()}.xls`;
      a.click();
      message.success({ key: 'logs-export', content: 'Sənəd yüklənir' });
    } else {
      message.error({ key: 'logs-export', content: result.data as string });
    }
  }, [state.filters]);

  const handleExportDeclarationChanges = useCallback(async () => {
    setExporting(true);
    const result = await LogsService.exportDeclarationChanges(
      startDate ? startDate.format('YYYY-MM-DD') : '',
      endDate ? endDate.format('YYYY-MM-DD') : '',
    );
    setExporting(false);
    if (result.status === 200) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_declaration_changes_${Date.now()}.xls`;
      a.click();
      setExportModalOpen(false);
      setStartDate(null);
      setEndDate(null);
      message.success('Sənəd yüklənir');
    } else {
      message.error(result.data as string);
    }
  }, [startDate, endDate]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {selectionCount === 0 ? (
            <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledHeaderButton type="text" onClick={handleResetSelection} icon={<Icons.CloseCircleOutlined />}>
              {selectionCount} sətir
            </StyledHeaderButton>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
        <Space>
          {can('declaration_transfer_export') && (
            <StyledHeaderButton type="text" onClick={() => setExportModalOpen(true)} icon={<Icons.FileExcelOutlined />}>
              Bağlama düzəliş export
            </StyledHeaderButton>
          )}
          {hasFilters && (
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  { key: 'export', label: 'Export', icon: <Icons.FileExcelOutlined />, onClick: handleExportAsExcel },
                ],
              }}
            >
              <StyledHeaderButton type="text" icon={<Icons.DownCircleOutlined />}>Digər</StyledHeaderButton>
            </Dropdown>
          )}
        </Space>
      </StyledActionBar>

      <Modal
        open={exportModalOpen}
        title="Bağlama düzəliş export"
        okText="Export"
        cancelText="Ləğv et"
        onCancel={() => { setExportModalOpen(false); setStartDate(null); setEndDate(null); }}
        onOk={handleExportDeclarationChanges}
        confirmLoading={exporting}
      >
        <Space direction="vertical" style={{ width: '100%', paddingTop: 16 }}>
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Başlanğıc tarixi"
            value={startDate}
            onChange={setStartDate}
            format="DD.MM.YYYY"
          />
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Bitmə tarixi"
            value={endDate}
            onChange={setEndDate}
            format="DD.MM.YYYY"
          />
        </Space>
      </Modal>
    </HeadPortal>
  );
};
