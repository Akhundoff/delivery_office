import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { PlansTableContext } from '../context';

export const PlansActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset, handleSelectAll, handleResetSelection, state } = useContext(PlansTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space size={0}>
          <StyledHeaderButton type="text" onClick={() => navigate('/plans/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni
          </StyledHeaderButton>
          {!selectionCount ? (
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
        <Space size={0}>
          <StyledHeaderButton type="text" onClick={() => navigate('/plans/categories', { withBackground: true })} icon={<Icons.UnorderedListOutlined />}>
            Xüsusi tariflər
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
