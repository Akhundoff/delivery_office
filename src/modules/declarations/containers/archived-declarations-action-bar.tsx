import { useCallback, useContext } from 'react';
import { Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { tableFilterQueryMaker } from '@shared/modules/next-table/utils';
import { ArchivedDeclarationsTableContext } from '../context';
import { ArchivedDeclarationsService } from '../services';

export const ArchivedDeclarationsActionBar = () => {
  const { handleFetch, handleReset, handleSelectAll, handleResetSelection, state } = useContext(ArchivedDeclarationsTableContext);
  const selectionCount = Object.values(state.selectedRowIds).filter(Boolean).length;

  const exportAsExcel = useCallback(async () => {
    message.loading({ key: 'archived-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await ArchivedDeclarationsService.getExcel(tableFilterQueryMaker(state.filters));
    message.destroy('archived-export');
    if (result.status === 200) {
      message.success('Sənəd yüklənir.');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `archived_declarations_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
      a.remove();
    } else {
      message.error(result.data as string);
    }
  }, [state.filters]);

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
          <StyledHeaderButton type="text" disabled>
            Cəmi: {state.total}
          </StyledHeaderButton>
        </Space>
        <Space>
          <StyledHeaderButton type="text" onClick={exportAsExcel} icon={<Icons.FileExcelOutlined />}>
            Export
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
