import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { ArchiveStatusTableContext } from '../context';

export const ArchiveStatusActionBar = () => {
  const { handleFetch, handleReset, handleSelectAll, handleResetSelection, state } = useContext(ArchiveStatusTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;

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
              {selectionCount} sətir seçilib
            </StyledHeaderButton>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
