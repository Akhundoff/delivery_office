import { useContext } from "react";
import { Space } from "antd";
import * as Icons from "@ant-design/icons";
import { HeadPortal } from "@modules/layout/components/head-portal";
import { StyledHeaderButton } from "@modules/layout/styled";
import { StyledActionBar } from "@shared/styled/action-bar";
import { RefundsTableContext } from "../context";

export const RefundsActionBar = () => {
  const { handleFetch, handleReset } = useContext(RefundsTableContext);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
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
