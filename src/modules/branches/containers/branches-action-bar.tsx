import { useContext } from 'react';
import { Dropdown, MenuProps, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { MeContext } from '@modules/me/context/context';
import { BranchesTableContext } from '../context';

export const BranchesActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset, handleSelectAll, handleResetSelection, state } = useContext(BranchesTableContext);
  const { can } = useContext(MeContext);
  const selectedCount = Object.keys(state.selectedRowIds || {}).length;

  const integrationsItems: MenuProps['items'] = [{ key: 'flyex', label: 'Flyex Filialları', onClick: () => navigate('/branches/flyex-locations') }];

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {can('branch_add') && (
            <StyledHeaderButton type="text" onClick={() => navigate('/branches/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
              Yeni
            </StyledHeaderButton>
          )}
          {!selectedCount ? (
            <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledHeaderButton type="text" onClick={handleResetSelection} icon={<Icons.CloseCircleOutlined />}>
              {selectedCount} sətir seçilib
            </StyledHeaderButton>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
        <Space>
          <Dropdown menu={{ items: integrationsItems }} placement="bottomRight">
            <StyledHeaderButton type="text" icon={<Icons.LinkOutlined />}>
              İnteqrasiyalar
            </StyledHeaderButton>
          </Dropdown>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
