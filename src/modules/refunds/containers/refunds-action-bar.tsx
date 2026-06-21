import { useCallback, useContext } from 'react';
import { Modal, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { tableFilterQueryMaker } from '@shared/modules/next-table/utils/query-maker';
import { RefundsTableContext } from '../context';
import { RefundsService } from '../services';

export const RefundsActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(RefundsTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;
  const selectedIds = Object.keys(state.selectedRowIds).map(Number);

  const remove = useCallback(() => {
    Modal.confirm({
      title: 'Diqqət',
      content: `${selectionCount} iadəni silməyə əminsinizmi?`,
      okType: 'danger',
      okText: 'Sil',
      cancelText: 'Ləğv et',
      onOk: async () => {
        const result = await RefundsService.delete(selectedIds);
        if (result.status === 200) {
          message.success('İadələr silindi.');
          handleFetch();
          handleResetSelection();
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [selectionCount, selectedIds, handleFetch, handleResetSelection]);

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'refunds-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await RefundsService.getExcel(tableFilterQueryMaker(state.filters));
    if (result.status === 200) {
      message.success({ key: 'refunds-export', content: 'Sənəd yüklənir.' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `refunds_export_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
    } else {
      message.error({ key: 'refunds-export', content: result.data as string });
    }
  }, [state.filters]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={() => navigate('/refunds/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni
          </StyledHeaderButton>
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
          <StyledHeaderButton type="text" onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>
            Export
          </StyledHeaderButton>
        </Space>
        {!!selectionCount && (
          <Space>
            <StyledHeaderButton type="text" danger onClick={remove} icon={<Icons.DeleteOutlined />}>
              Sil
            </StyledHeaderButton>
          </Space>
        )}
      </StyledActionBar>
    </HeadPortal>
  );
};
