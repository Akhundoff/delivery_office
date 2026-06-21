import React, { useContext } from 'react';
import * as Icons from '@ant-design/icons';
import { Space } from 'antd';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { DiscountUsersTableContext } from '../context';
import { UsersService } from '../services';

export const DiscountUsersActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(DiscountUsersTableContext);
  const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;

  const handleExport = async () => {
    const result = await UsersService.exportDiscountUsersExcel();
    if (result.status === 200) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `discount_users_export_${Date.now()}.xls`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={() => navigate('/users')} icon={<Icons.ArrowLeftOutlined />}>
            İstifadəçilər
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
          {!!state.data.length && (
            <StyledHeaderButton type="text" onClick={handleExport} icon={<Icons.DownloadOutlined />}>
              Export
            </StyledHeaderButton>
          )}
        </Space>
        {!selectionCount && (
          <Space>
            <StyledHeaderButton type="text" onClick={() => navigate('/statistics/qizil-onluq', { withBackground: false })} icon={<Icons.TrophyOutlined />}>
              Qızıl onluq
            </StyledHeaderButton>
          </Space>
        )}
      </StyledActionBar>
    </HeadPortal>
  );
};
