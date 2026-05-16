import { useContext } from "react";
import { Space } from "antd";
import * as Icons from "@ant-design/icons";
import { HeadPortal } from "@modules/layout/components/head-portal";
import { StyledHeaderButton } from "@modules/layout/styled";
import { StyledActionBar } from "@shared/styled/action-bar";
import { useSelection } from "@shared/modules/next-table/hooks";
import { AzerpostQueuesTableContext } from "../context";

export const AzerpostQueuesActionBar = () => {
  const { handleFetch, handleReset, state, handleSelectAll, handleResetSelection } = useContext(AzerpostQueuesTableContext);
  const selection = useSelection(state.selectedRowIds);
  const selectionCount = selection.length;

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {!selectionCount ? (
            <StyledHeaderButton type='text' onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledActionBar.Selection>
              <Icons.CloseCircleTwoTone twoToneColor='#ff4d4f' onClick={handleResetSelection} style={{ cursor: 'pointer', fontSize: 16 }} role='icon' />
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
      </StyledActionBar>
    </HeadPortal>
  );
};
