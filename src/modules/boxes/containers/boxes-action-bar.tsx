import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { BoxesTableContext } from '../context';

export const BoxesActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset, state } = useContext(BoxesTableContext);
  const branchId = state.filters.find((f: any) => f.id === 'branch_id')?.value;

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={() => navigate('/boxes/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          <StyledHeaderButton type="text" disabled={!branchId} onClick={() => navigate(`/box-transfers/${branchId}/branch`)} icon={<Icons.HistoryOutlined />}>
            Tarixçə
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
