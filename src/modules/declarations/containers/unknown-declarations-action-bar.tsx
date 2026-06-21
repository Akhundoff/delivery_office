import { useContext } from 'react';
import { Modal, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { UnknownDeclarationsTableContext } from '../context';
import { UnknownDeclarationsService } from '../services';

export const UnknownDeclarationsActionBar = () => {
  const backgroundNavigate = useBackgroundNavigate();
  const { state, handleFetch, handleReset, handleSelectAll, handleResetSelection } = useContext(UnknownDeclarationsTableContext);
  const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;
  const selectedIds = Object.keys(state.selectedRowIds).filter((k) => state.selectedRowIds[k]);

  const handleBulkCancel = () => {
    Modal.confirm({
      title: 'Diqqət',
      content: 'Seçilmiş bağlamaları ləğv etmək istədiyinizdən əminsinizmi?',
      okType: 'danger',
      okText: 'Ləğv et',
      cancelText: 'Bağla',
      onOk: async () => {
        const result = await UnknownDeclarationsService.cancel(selectedIds);
        if (result.status === 200) {
          message.success('Ləğv edildi');
          handleResetSelection();
          handleFetch();
        } else {
          message.error(result.data as string);
        }
      },
    });
  };

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" icon={<Icons.PlusCircleOutlined />} onClick={() => backgroundNavigate('/declarations/unknowns/create', { withBackground: true })}>
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
        </Space>
        {!!selectionCount && (
          <Space>
            <StyledHeaderButton type="text" danger onClick={handleBulkCancel} icon={<Icons.DeleteOutlined />}>
              Ləğv et
            </StyledHeaderButton>
          </Space>
        )}
      </StyledActionBar>
    </HeadPortal>
  );
};
