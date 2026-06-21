import React, { useContext } from 'react';
import { Menu } from 'antd';
import * as Icons from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { StyledSider, SiderOverlay, Brand, InspectionBadge } from '../styled';
import { useSidebar } from '../hooks';
import { MeContext } from '@modules/me/context/context';
import { useInspectionBadge } from '@modules/branch-inspections';
import { useCounter } from '@modules/counter';

export const AppSidebar = () => {
  const { isOpen, activeKey, toggleSidebar } = useSidebar();
  const { can, canDisplay, hasAnyPermission } = useContext(MeContext);
  const { shouldShowBadge } = useInspectionBadge();
  const { state: counter, onMouseEnter } = useCounter();

  return (
    <React.Fragment>
      <StyledSider trigger={null} collapsible width={224} collapsedWidth={46} collapsed={!isOpen} className={isOpen ? 'active' : 'inactive'}>
        <Brand>{isOpen ? <img src="/logo.svg" alt={process.env.REACT_APP_COMPANY_NAME} /> : <img src="/logo-compact.svg" alt={process.env.REACT_APP_COMPANY_NAME} />}</Brand>
        <Menu onMouseOver={onMouseEnter} theme="dark" mode="inline" selectedKeys={[activeKey]}>
          {canDisplay('*') && (
            <>
              <Menu.ItemGroup title="Ümumi">
                {can('stat') && (
                  <Menu.Item key="/statistics" icon={<Icons.LineChartOutlined />}>
                    Statistika
                    <NavLink to="/statistics" />
                  </Menu.Item>
                )}
                {can('client_appointment') && (
                  <Menu.Item key="/appointment" icon={<Icons.FileSearchOutlined />}>
                    Müştəri qəbul
                    <NavLink to="/appointment" />
                  </Menu.Item>
                )}
                {can('local_warehouse') && (
                  <Menu.Item key="/warehouse/handover/queues" icon={<Icons.UserSwitchOutlined />}>
                    Anbardar təhvil ({counter.handoverQueue.pending}/{counter.handoverQueue.executing})
                    <NavLink to="/warehouse/handover/queues" />
                  </Menu.Item>
                )}
                {can('cashflow') && (
                  <Menu.Item key="/cash-flow" icon={<Icons.MoneyCollectOutlined />}>
                    Cashflow
                    <NavLink to="/cash-flow" />
                  </Menu.Item>
                )}
              </Menu.ItemGroup>
              <Menu.ItemGroup title="Əsas menyu">
                {can('users') && (
                  <Menu.Item key="/users" icon={<Icons.UserOutlined />}>
                    Müştərilər
                    <NavLink to="/users" />
                  </Menu.Item>
                )}
                {can('orders') && (
                  <Menu.Item key="/orders" icon={<Icons.ShoppingCartOutlined />}>
                    Sifarişlər {!!counter.declarations && `(${counter.orders})`}
                    <NavLink to="/orders" />
                  </Menu.Item>
                )}
                <Menu.Item key="/declarations" icon={<Icons.FileTextOutlined />}>
                  Bağlamalar {!!counter.declarations && `(${counter.declarations})`}
                  <NavLink to="/declarations" />
                </Menu.Item>
                {can('trendyol_declarations') && (
                  <Menu.Item key="/united-declarations" icon={<Icons.FileTextOutlined />}>
                    United Bağlamalar
                    <NavLink to="/united-declarations" />
                  </Menu.Item>
                )}
                {can('united_returns') && (
                  <Menu.Item key="/united-returns" icon={<Icons.RollbackOutlined />}>
                    Temu Geri Qaytarmalar
                    <NavLink to="/united-returns" />
                  </Menu.Item>
                )}
                {can('partner_declarations') && (
                  <Menu.Item key="/declarations/partners" icon={<Icons.FileTextOutlined />}>
                    Partnyor Bağlamalar
                    <NavLink to="/declarations/partners" />
                  </Menu.Item>
                )}
                {can('parcel_sorting_list') && (
                  <Menu.Item key="/sorting" icon={<Icons.DeliveredProcedureOutlined />}>
                    Filial göndərişləri
                    <NavLink to="/sorting" />
                  </Menu.Item>
                )}
                {can('branch_inspections_list') && (
                  <Menu.Item key="/branch-inspections" icon={<Icons.AuditOutlined />}>
                    Filial yoxlanışları
                    {shouldShowBadge && <InspectionBadge />}
                    <NavLink to="/branch-inspections" />
                  </Menu.Item>
                )}
                {can('flights') && (
                  <Menu.Item key="/flights" icon={<Icons.RocketOutlined />}>
                    Uçuşlar
                    <NavLink to="/flights" />
                  </Menu.Item>
                )}
                {can('tickets') && (
                  <Menu.Item key="/supports" icon={<Icons.MessageOutlined />}>
                    Müraciətlər {!!counter.supports && `(${counter.supports})`}
                    <NavLink to="/supports" />
                  </Menu.Item>
                )}
                {can('transactions') && (
                  <Menu.Item key="/transactions" icon={<Icons.MoneyCollectOutlined />}>
                    Balans əməliyyatları
                    <NavLink to="/transactions" />
                  </Menu.Item>
                )}
                {can('couriers') && (
                  <Menu.Item key="/couriers" icon={<Icons.DropboxOutlined />}>
                    Kuryerlər {!!counter.couriers && `(${counter.couriers})`}
                    <NavLink to="/couriers" />
                  </Menu.Item>
                )}
                {can('courier_assignments') && (
                  <Menu.Item key="/couriers/deliverer-assignments" icon={<Icons.UserAddOutlined />}>
                    Kuryer təhkim
                    <NavLink to="/couriers/deliverer-assignments" />
                  </Menu.Item>
                )}
                {can('conflicted_declarations') && (
                  <Menu.Item key="/declarations/unknowns" icon={<Icons.CodeSandboxOutlined />}>
                    Mübahisəli bağlamalar {!!counter.unknownDeclarations && `(${counter.unknownDeclarations})`}
                    <NavLink to="/declarations/unknowns" />
                  </Menu.Item>
                )}
                {can('declarations_archive') && (
                  <Menu.Item key="/declarations/archived" icon={<Icons.FileTextOutlined />}>
                    Bağlamalar arxivi
                    <NavLink to="/declarations/archived" />
                  </Menu.Item>
                )}
                {can('bbs_office') && (
                  <Menu.Item key="/customs/tasks" icon={<Icons.DropboxOutlined />}>
                    BBS Tapşırıqları
                    <NavLink to="/customs/tasks" />
                  </Menu.Item>
                )}
              </Menu.ItemGroup>
              {hasAnyPermission('declarations') && (
                <Menu.ItemGroup title="Bəyannamələr">
                  {can('dgk_declarations') && (
                    <Menu.Item key="/customs/declarations" icon={<Icons.ExceptionOutlined />}>
                      Bəyannamələr
                      <NavLink to="/customs/declarations" />
                    </Menu.Item>
                  )}
                  {can('deleted_customs_declarations') && (
                    <Menu.Item key="/declarations/deleted" icon={<Icons.DeleteOutlined />}>
                      Silinmiş bəyannamələr
                      <NavLink to="/declarations/deleted" />
                    </Menu.Item>
                  )}
                  {can('dgk_declarations') && (
                    <Menu.Item key="/customs/posts" icon={<Icons.AuditOutlined />}>
                      DGK Bağlamalar
                      <NavLink to="/customs/posts" />
                    </Menu.Item>
                  )}
                  {can('post_declarations') && (
                    <Menu.Item key="/declarations/post" icon={<Icons.FileTextOutlined />}>
                      Bəyan sonrası bağlamalar
                      <NavLink to="/declarations/post" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
              {hasAnyPermission('queues') && (
                <Menu.ItemGroup title="Növbələr">
                  {can('bbs_queues') && (
                    <Menu.Item key="/customs/dns-queues" icon={<Icons.OrderedListOutlined />}>
                      BBS növbələri
                      <NavLink to="/customs/dns-queues" />
                    </Menu.Item>
                  )}
                  {can('united_queues') && (
                    <Menu.Item key="/united-queues" icon={<Icons.DropboxOutlined />}>
                      United növbələri
                      <NavLink to="/united-queues" />
                    </Menu.Item>
                  )}
                  {can('azerpost_queues') && (
                    <Menu.Item key="/azerpost-queues" icon={<Icons.DropboxOutlined />}>
                      Azərpoçt növbələri
                      <NavLink to="/azerpost-queues" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
              {hasAnyPermission('notify') && (
                <Menu.ItemGroup title="Bildirişlər">
                  {can('sms_archive') && (
                    <Menu.Item key="/notifier/sms" icon={<Icons.TabletOutlined />}>
                      SMS Arxivi
                      <NavLink to="/notifier/sms" />
                    </Menu.Item>
                  )}
                  {can('whatsapp_archive') && (
                    <Menu.Item key="/notifier/whatsapp" icon={<Icons.WhatsAppOutlined />}>
                      Whatsapp Arxivi
                      <NavLink to="/notifier/whatsapp" />
                    </Menu.Item>
                  )}
                  {can('mail_archive') && (
                    <Menu.Item key="/notifier/email" icon={<Icons.MailOutlined />}>
                      Mail Arxivi
                      <NavLink to="/notifier/email" />
                    </Menu.Item>
                  )}
                  {can('bulk_app_notification') && (
                    <Menu.Item key="/notifier/mobile/bulk/send" icon={<Icons.NotificationOutlined />}>
                      APP bildiriş
                      <NavLink to="/notifier/mobile/bulk/send" />
                    </Menu.Item>
                  )}
                  {can('notification_templates') && (
                    <Menu.Item key="/notifier/templates" icon={<Icons.NotificationOutlined />}>
                      Bildiriş şablonları
                      <NavLink to="/notifier/templates" />
                    </Menu.Item>
                  )}
                  {can('ticket_templates') && (
                    <Menu.Item key="/ticket-templates" icon={<Icons.FileTextOutlined />}>
                      Müraciət şablonları
                      <NavLink to="/ticket-templates" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
              {hasAnyPermission('content') && (
                <Menu.ItemGroup title="Məzmun">
                  {can('state_changes') && (
                    <Menu.Item key="/archive/state" icon={<Icons.DatabaseOutlined />}>
                      Status Arxivi
                      <NavLink to="/archive/state" />
                    </Menu.Item>
                  )}
                  {can('my_logs') && (
                    <Menu.Item key="/logs" icon={<Icons.HistoryOutlined />}>
                      Əməliyyat Arxivi
                      <NavLink to="/logs" />
                    </Menu.Item>
                  )}
                  {can('news') && (
                    <Menu.Item key="/news" icon={<Icons.ReadOutlined />}>
                      Xəbərlər
                      <NavLink to="/news" />
                    </Menu.Item>
                  )}
                  {can('faq') && (
                    <Menu.Item key="/faq" icon={<Icons.QuestionCircleOutlined />}>
                      Tez-tez verilən suallar
                      <NavLink to="/faq" />
                    </Menu.Item>
                  )}
                  {can('shops') && (
                    <Menu.Item key="/shops" icon={<Icons.ShopOutlined />}>
                      Mağazalar
                      <NavLink to="/shops" />
                    </Menu.Item>
                  )}
                  {can('about') && (
                    <Menu.Item key="/about" icon={<Icons.InfoCircleOutlined />}>
                      Haqqında
                      <NavLink to="/about" />
                    </Menu.Item>
                  )}
                  {can('transportation_conditions') && (
                    <Menu.Item key="/transportation_conditions" icon={<Icons.SnippetsOutlined />}>
                      Daşınma şərtləri
                      <NavLink to="/transportation_conditions" />
                    </Menu.Item>
                  )}
                  {can('banners') && (
                    <Menu.Item key="/banners" icon={<Icons.FileImageOutlined />}>
                      Bannerlər
                      <NavLink to="/banners" />
                    </Menu.Item>
                  )}
                  {can('popups') && (
                    <Menu.Item key="/popups" icon={<Icons.BorderOutlined />}>
                      Popuplar
                      <NavLink to="/popups" />
                    </Menu.Item>
                  )}
                  {can('delivery_proof') && (
                    <Menu.Item key="/delivery-proofs" icon={<Icons.FileOutlined />}>
                      Təhvil sənədləri
                      <NavLink to="/delivery-proofs" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
              {hasAnyPermission('settings') && (
                <Menu.ItemGroup title="Proqram ayarları">
                  {can('system_settings') && (
                    <Menu.Item key="/settings" icon={<Icons.SettingOutlined />}>
                      Sistem ayarları
                      <NavLink to="/settings" />
                    </Menu.Item>
                  )}
                  {can('coupons') && (
                    <Menu.Item key="/coupons" icon={<Icons.GiftOutlined />}>
                      Kuponlar
                      <NavLink to="/coupons" />
                    </Menu.Item>
                  )}
                  {can('returns') && (
                    <Menu.Item key="/refunds" icon={<Icons.RollbackOutlined />}>
                      İadələr
                      <NavLink to="/refunds" />
                    </Menu.Item>
                  )}
                  {can('cashback') && (
                    <Menu.Item key="/cashback" icon={<Icons.SketchOutlined />}>
                      Kəşbəklər
                      <NavLink to="/cashback" />
                    </Menu.Item>
                  )}
                  {can('foreign_cargoes') && (
                    <Menu.Item key="/cargoes" icon={<Icons.CodeSandboxOutlined />}>
                      Xarici karqolar
                      <NavLink to="/cargoes" />
                    </Menu.Item>
                  )}
                  {can('containers') && (
                    <Menu.Item key="/boxes" icon={<Icons.InboxOutlined />}>
                      Yeşiklər
                      <NavLink to="/boxes" />
                    </Menu.Item>
                  )}
                  {can('shop_names') && (
                    <Menu.Item key="/shop-names" icon={<Icons.ShoppingOutlined />}>
                      Xarici Mağazalar
                      <NavLink to="/shop-names" />
                    </Menu.Item>
                  )}
                  {can('return_reasons') && (
                    <Menu.Item key="/return-types" icon={<Icons.RollbackOutlined />}>
                      İadə səbəbləri
                      <NavLink to="/return-types" />
                    </Menu.Item>
                  )}
                  {can('countries') && (
                    <Menu.Item key="/countries" icon={<Icons.CarOutlined />}>
                      Ölkələr
                      <NavLink to="/countries" />
                    </Menu.Item>
                  )}
                  {can('branches') && (
                    <Menu.Item key="/branches" icon={<Icons.BranchesOutlined />}>
                      Filiallar
                      <NavLink to="/branches" />
                    </Menu.Item>
                  )}
                  {can('companies') && (
                    <Menu.Item key="/branch-partners" icon={<Icons.BranchesOutlined />}>
                      Şirkətlər
                      <NavLink to="/branch-partners" />
                    </Menu.Item>
                  )}
                  {can('tarifs') && (
                    <Menu.Item key="/plans" icon={<Icons.FormOutlined />}>
                      Tariflər
                      <NavLink to="/plans" />
                    </Menu.Item>
                  )}
                  {can('producttypes') && (
                    <Menu.Item key="/product-types" icon={<Icons.BuildOutlined />}>
                      Məhsul tipləri
                      <NavLink to="/product-types" />
                    </Menu.Item>
                  )}
                  {can('regions') && (
                    <Menu.Item key="/regions" icon={<Icons.TranslationOutlined />}>
                      Rayonlar
                      <NavLink to="/regions" />
                    </Menu.Item>
                  )}
                  {can('models') && (
                    <Menu.Item key="/models" icon={<Icons.StarOutlined />}>
                      Modellər
                      <NavLink to="/models" />
                    </Menu.Item>
                  )}
                  {can('states') && (
                    <Menu.Item key="/status" icon={<Icons.WalletOutlined />}>
                      Statuslar
                      <NavLink to="/status" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
            </>
          )}
          {(canDisplay('*') || canDisplay('partner')) && (
            <Menu.ItemGroup title="Filial bölmələri">
              <Menu.Item key="/partner-boxes" icon={<Icons.InboxOutlined />}>
                Yeşiklər
                <NavLink to="/partner-boxes" />
              </Menu.Item>
              <Menu.Item key="/partner/acceptance/box" icon={<Icons.FileTextOutlined />}>
                Bağlama qəbulu
                <NavLink to="/partner/acceptance/box" />
              </Menu.Item>
              {can('branch_manager') && (
                <Menu.Item key="/statistics/branches-partner" icon={<Icons.LineChartOutlined />}>
                  Yerli anbar statistikası
                  <NavLink to="/statistics/branches-partner" />
                </Menu.Item>
              )}
            </Menu.ItemGroup>
          )}
        </Menu>
      </StyledSider>
      <SiderOverlay $visible={isOpen} onClick={toggleSidebar} />
    </React.Fragment>
  );
};
