import { useCallback, useContext, useMemo } from 'react';
import { Modal, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { CashbacksTableContext } from '../context';
import { CashbacksService } from '../services';

export const CashbacksActionBar = () => {
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(CashbacksTableContext);
  const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;
  const selectedIds = useMemo(
    () =>
      Object.entries(state.selectedRowIds)
        .filter(([, v]) => v)
        .map(([k]) => Number(k)),
    [state.selectedRowIds],
  );

  const confirmStatus = useCallback(() => {
    Modal.confirm({
      title: 'Diqqət',
      content: `${selectionCount} kəşbəkin statusunu dəyişməyə əminsinizmi?`,
      onOk: async () => {
        const result = await CashbacksService.updateTransactionsStatus(selectedIds);
        if (result.status === 200) {
          message.success('Status dəyişdirildi.');
          handleFetch();
          handleResetSelection();
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [selectedIds, selectionCount, handleFetch, handleResetSelection]);

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
              <span>{selectionCount} sətir seçilib</span>
            </StyledActionBar.Selection>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
        <Space>
          <StyledHeaderButton type="text" onClick={confirmStatus} icon={<Icons.CheckOutlined />} disabled={!selectionCount}>
            Kəşbəki təsdiqlə
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
