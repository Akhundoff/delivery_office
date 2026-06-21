import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { MeContext } from '@modules/me/context/context';
import { SmsNotificationsTableContext } from '../context';

export const SmsNotificationsActionBar = () => {
  const { handleFetch, handleReset, handleSelectAll, handleResetSelection, state } = useContext(SmsNotificationsTableContext);
  const { can } = useContext(MeContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {can('bulk_sms') && (
            <NavLink to="/notifier/sms/bulk/send">
              <StyledHeaderButton type="text" icon={<Icons.PlusCircleOutlined />}>
                Toplu sms göndər
              </StyledHeaderButton>
            </NavLink>
          )}
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
        <Space>
          <NavLink to="/notifier/queue-sms">
            <StyledHeaderButton type="text" icon={<Icons.FieldTimeOutlined />}>
              Növbədəkilər
            </StyledHeaderButton>
          </NavLink>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
