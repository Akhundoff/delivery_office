import React, { useCallback, useContext } from 'react';
import { Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { UnitedReturnsTableContext } from '../context';
import { UnitedReturnsService } from '../services';

export const UnitedReturnsActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(UnitedReturnsTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'united-returns-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const query: Record<string, any> = {};
    state.filters.forEach((f: any) => { query[f.id] = f.value; });
    const result = await UnitedReturnsService.getExcel(query);
    if (result.status === 200) {
      message.success({ key: 'united-returns-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = 'united_returns_export.xls';
      a.click();
    } else {
      message.error({ key: 'united-returns-export', content: result.data as string });
    }
  }, [state.filters]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type='text' onClick={() => navigate('/united-returns/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni
          </StyledHeaderButton>
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
          <StyledHeaderButton type='text' disabled>Cəmi: {state.total}</StyledHeaderButton>
        </Space>
        <Space>
          <StyledHeaderButton type='text' onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>
            Excel export
          </StyledHeaderButton>
          <StyledHeaderButton type='text' onClick={() => navigate('/united-returns/execution')} icon={<Icons.ScheduleOutlined />}>
            Göndəriş icrası
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
