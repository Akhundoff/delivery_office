import { useCallback, useContext } from 'react';
import { Dropdown, MenuProps, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { PartnerDeclarationsTableContext } from '../context';
import { PartnerDeclarationsService } from '../services';

export const PartnerDeclarationsActionBar = () => {
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(PartnerDeclarationsTableContext);
  const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await PartnerDeclarationsService.getExcel(state.filters ?? {});
    if (result.status === 200) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `partner_declarations_${Date.now()}.xls`;
      a.click();
      message.success({ key: 'export', content: 'Sənəd yüklənir' });
    } else {
      message.error({ key: 'export', content: result.data as string });
    }
  }, [state.filters]);

  const exportMiniAsExcel = useCallback(async () => {
    message.loading({ key: 'export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await PartnerDeclarationsService.getExcel(state.filters ?? {}, true);
    if (result.status === 200) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `partner_declarations_mini_${Date.now()}.xls`;
      a.click();
      message.success({ key: 'export', content: 'Sənəd yüklənir' });
    } else {
      message.error({ key: 'export', content: result.data as string });
    }
  }, [state.filters]);

  const exportMenuItems: MenuProps['items'] = [
    { key: 'export', label: 'Export', icon: <Icons.FileExcelOutlined />, onClick: exportAsExcel },
    { key: 'mini', label: 'Mini Export', icon: <Icons.FileExcelOutlined />, onClick: exportMiniAsExcel },
  ];

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {!selectionCount ? (
            <StyledHeaderButton type='text' onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledActionBar.Selection>
              <Icons.CloseCircleTwoTone twoToneColor='#ff4d4f' onClick={handleResetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role='icon' />
              <span>{selectionCount} seçilib</span>
            </StyledActionBar.Selection>
          )}
          <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          <StyledHeaderButton type='text' disabled>
            Cəmi: {state.total}
          </StyledHeaderButton>
        </Space>
        {!selectionCount && (
          <Space>
            <Dropdown menu={{ items: exportMenuItems }} trigger={['click']}>
              <StyledHeaderButton type='text' icon={<Icons.DownCircleOutlined />}>
                Digər
              </StyledHeaderButton>
            </Dropdown>
          </Space>
        )}
      </StyledActionBar>
    </HeadPortal>
  );
};
