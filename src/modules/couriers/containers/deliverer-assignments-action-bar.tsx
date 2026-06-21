import React, { useCallback, useContext, useMemo } from 'react';
import { Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import Cookies from 'js-cookie';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { tableFilterQueryMaker } from '@shared/modules/next-table/utils';
import { urlMaker } from '@shared/utils';
import { DelivererAssignmentsTableContext } from '../context';
import { CouriersService } from '../services';

export const DelivererAssignmentsActionBar = () => {
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(DelivererAssignmentsTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;
  const selectedIds = Object.keys(state.selectedRowIds).map(Number);

  const filterQuery = useMemo(() => tableFilterQueryMaker(state.filters), [state.filters]);

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'da-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await CouriersService.getDelivererAssignmentsExcel(filterQuery);
    if (result.status === 200) {
      message.success({ key: 'da-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `deliverer_assignments_export_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
    } else {
      message.error({ key: 'da-export', content: result.data as string });
    }
  }, [filterQuery]);

  const printHanding = useCallback(() => {
    const token = Cookies.get('accessToken') || '';
    window.open(urlMaker('/api/admin/couriers/handing', { ...filterQuery, Authorization: token }));
  }, [filterQuery]);

  const removeSelected = useCallback(async () => {
    const result = await CouriersService.removeDelivererAssignments(selectedIds);
    if (result.status === 200) {
      message.success('Silindi.');
      handleFetch();
      handleResetSelection();
    } else message.error(result.data as string);
  }, [selectedIds, handleFetch, handleResetSelection]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {!selectionCount ? (
            <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledActionBar.Selection>
              <Icons.CloseCircleTwoTone twoToneColor="#ff4d4f" onClick={handleResetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role="icon" />
              <span>{selectionCount} seçilib</span>
            </StyledActionBar.Selection>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          <StyledHeaderButton type="text" disabled>
            Cəmi: {state.total}
          </StyledHeaderButton>
        </Space>
        <Space>
          {!!selectionCount && (
            <StyledHeaderButton type="text" danger onClick={removeSelected} icon={<Icons.DeleteOutlined />}>
              Kuryerdən al
            </StyledHeaderButton>
          )}
          <StyledHeaderButton type="text" onClick={printHanding} icon={<Icons.FileTextOutlined />}>
            Təhvil sənədi
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>
            Excel export
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
