import { useContext } from "react";
import { Dropdown, MenuProps, Space } from "antd";
import * as Icons from "@ant-design/icons";
import { HeadPortal } from "@modules/layout/components/head-portal";
import { StyledHeaderButton } from "@modules/layout/styled";
import { StyledActionBar } from "@shared/styled/action-bar";
import { useBackgroundNavigate } from "@shared/hooks";
import { BranchesTableContext } from "../context";

export const BranchesActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset } = useContext(BranchesTableContext);

  const integrationsItems: MenuProps["items"] = [
    { key: "flyex", label: "Flyex Filialları", onClick: () => navigate("/branches/flyex-locations") },
  ];

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton
            type="text"
            onClick={() => navigate("/branches/create", { withBackground: true })}
            icon={<Icons.PlusCircleOutlined />}
          >
            Yeni
          </StyledHeaderButton>
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
