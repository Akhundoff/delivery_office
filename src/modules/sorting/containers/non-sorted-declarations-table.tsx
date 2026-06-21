import { FC, useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { NextTable } from '@shared/modules/next-table/containers';
import { NonSortedDeclarationsTableContext } from '../context';
import { useNonSortedDeclarationsTableColumns } from '../hooks';

export const NonSortedDeclarationsTable: FC = () => {
  const columns = useNonSortedDeclarationsTableColumns();
  const { handleFetch, handleReset, handleSelectAll, handleResetSelection, state } = useContext(NonSortedDeclarationsTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;

  return (
    <>
      <HeadPortal>
        <StyledActionBar $flex={true}>
          <Space size={0}>
            {!selectionCount ? (
              <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
                Hamısını seç
              </StyledHeaderButton>
            ) : (
              <StyledHeaderButton type="text" onClick={handleResetSelection} icon={<Icons.CloseCircleOutlined />}>
                {selectionCount} sətir
              </StyledHeaderButton>
            )}
            <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
              Yenilə
            </StyledHeaderButton>
            <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
              Sıfırla
            </StyledHeaderButton>
            <StyledHeaderButton type="text">Cəmi: {state.total}</StyledHeaderButton>
          </Space>
        </StyledActionBar>
      </HeadPortal>
      <NextTable context={NonSortedDeclarationsTableContext} columns={columns} />
    </>
  );
};
