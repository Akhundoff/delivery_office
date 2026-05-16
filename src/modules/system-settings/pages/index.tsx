import { FC, useState } from "react";
import { Collapse } from "antd";
import { PageContent } from "@shared/styled/page-content";
import { OthersSettings, CashbackSettings, MailSettings } from "../containers";

type SettingKey = "others" | "cashback" | "email";

export const SystemSettingsPage: FC = () => {
  const [activeKeys, setActiveKeys] = useState<SettingKey[]>(["others"]);

  return (
    <PageContent $contain={true}>
      <Collapse
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(Array.isArray(keys) ? (keys as SettingKey[]) : [keys as SettingKey])}
      >
        <Collapse.Panel header="Digər tənzimləmələr" key="others">
          {activeKeys.includes("others") && <OthersSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Kəşbək tənzimləmələri" key="cashback">
          {activeKeys.includes("cashback") && <CashbackSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Mail tənzimləmələri" key="email">
          {activeKeys.includes("email") && <MailSettings />}
        </Collapse.Panel>
      </Collapse>
    </PageContent>
  );
};
