import { FC, useState } from 'react';
import { Collapse } from 'antd';
import { PageContent } from '@shared/styled/page-content';
import { OthersSettings, CashbackSettings, MailSettings, AzerpostSettings, TrendyolSettings, TopupSettings, CashflowSettings, BranchesSettings, WarehousesSettings } from '../containers';

type SettingKey = 'cashflow' | 'cashback' | 'azerpost' | 'email' | 'trendyol' | 'topup' | 'others' | 'branches' | 'warehouses';

export const SystemSettingsPage: FC = () => {
  const [activeKeys, setActiveKeys] = useState<SettingKey[]>(['cashflow']);

  return (
    <PageContent $contain={true}>
      <Collapse activeKey={activeKeys} onChange={(keys) => setActiveKeys(Array.isArray(keys) ? (keys as SettingKey[]) : [keys as SettingKey])}>
        <Collapse.Panel header="Cashflow tənzimləmələri" key="cashflow">
          {activeKeys.includes('cashflow') && <CashflowSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Kəşbək tənzimləmələri" key="cashback">
          {activeKeys.includes('cashback') && <CashbackSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Azərpoçt tarifləri" key="azerpost">
          {activeKeys.includes('azerpost') && <AzerpostSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Mail tənzimləmələri" key="email">
          {activeKeys.includes('email') && <MailSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Trendyol tənzimləmələri" key="trendyol">
          {activeKeys.includes('trendyol') && <TrendyolSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Balans artımına icazə" key="topup">
          {activeKeys.includes('topup') && <TopupSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Digər tənzimləmələr" key="others">
          {activeKeys.includes('others') && <OthersSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Filial tənzimləmələri" key="branches">
          {activeKeys.includes('branches') && <BranchesSettings />}
        </Collapse.Panel>
        <Collapse.Panel header="Anbar tənzimləmələri" key="warehouses">
          {activeKeys.includes('warehouses') && <WarehousesSettings />}
        </Collapse.Panel>
      </Collapse>
    </PageContent>
  );
};
