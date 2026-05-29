import React, { useCallback, useContext } from 'react';
import { Dropdown, MenuProps, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { CouriersTableContext } from '../context';
import { CouriersService } from '../services';

export const CouriersActionBar = () => {
  const backgroundNavigate = useBackgroundNavigate();
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(CouriersTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;
  const selectedIds = Object.keys(state.selectedRowIds).map(Number);

  const { data: statusesResult } = useQuery(['statuses-for-couriers-bar', 3], () => StatusesService.getList({ per_page: 500, model_id: 3 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  const statusItems: MenuProps['items'] = statuses.map((s) => ({
    key: `bulk-status-${s.id}`,
    label: s.name,
    onClick: async () => {
      const result = await CouriersService.changeStatus(selectedIds, s.id);
      if (result.status === 200) { message.success('Status dəyişdirildi.'); handleFetch(); handleResetSelection(); }
      else message.error(result.data as string);
    },
  }));

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'couriers-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const query: Record<string, any> = {};
    state.filters.forEach((f: any) => { query[f.id] = f.value; });
    const result = await CouriersService.getExcel(query);
    if (result.status === 200) {
      message.success({ key: 'couriers-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = 'couriers_export.xls';
      a.click();
    } else {
      message.error({ key: 'couriers-export', content: result.data as string });
    }
  }, [state.filters]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type='text' onClick={() => backgroundNavigate('/couriers/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni kuryer
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
          {!!selectionCount && (
            <Dropdown menu={{ items: statusItems }} trigger={['click']}>
              <StyledHeaderButton type='text' icon={<Icons.AppstoreOutlined />}>Statusu dəyiş</StyledHeaderButton>
            </Dropdown>
          )}
          <StyledHeaderButton type='text' onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>
            Excel export
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
