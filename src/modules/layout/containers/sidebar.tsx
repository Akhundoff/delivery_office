import React, { useContext } from 'react';
import { Menu } from 'antd';
import * as Icons from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { StyledSider, SiderOverlay, Brand } from '../styled';
import { useSidebar } from '../hooks';
import { MeContext } from '@modules/me/context/context';

export const AppSidebar = () => {
    const { isOpen, activeKey, toggleSidebar } = useSidebar();
    const { can } = useContext(MeContext);

    return (
        <React.Fragment>
            <StyledSider trigger={null} collapsible width={224} collapsedWidth={46} collapsed={!isOpen} className={isOpen ? 'active' : 'inactive'}>
                <Brand>
                    {isOpen ? <img src='/logo.svg' alt={process.env.REACT_APP_COMPANY_NAME} /> : <img src='/logo-compact.svg' alt={process.env.REACT_APP_COMPANY_NAME} />}
                </Brand>
                <Menu theme='dark' mode='inline' selectedKeys={[activeKey]}>
                    <Menu.Item key='/' icon={<Icons.HomeOutlined />}>
                        Ana səhifə
                        <NavLink to='/' />
                    </Menu.Item>
                    <Menu.ItemGroup title='Əsas menyu'>
                        <Menu.Item key='/users' icon={<Icons.TeamOutlined />}>
                            İstifadəçilər
                            <NavLink to='/users' />
                        </Menu.Item>
                        <Menu.Item key='/declarations' icon={<Icons.InboxOutlined />}>
                            Bağlamalar
                            <NavLink to='/declarations' />
                        </Menu.Item>
                        <Menu.Item key='/flights' icon={<Icons.RocketOutlined />}>
                            Uçuşlar
                            <NavLink to='/flights' />
                        </Menu.Item>
                        <Menu.Item key='/transactions' icon={<Icons.MoneyCollectOutlined />}>
                            Balans əməliyyatları
                            <NavLink to='/transactions' />
                        </Menu.Item>
                        <Menu.Item key='/declarations/archived' icon={<Icons.FileTextOutlined />}>
                            Bağlamalar arxivi
                            <NavLink to='/declarations/archived' />
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title='Bəyannamələr'>
                        <Menu.Item key='/customs/declarations' icon={<Icons.ExceptionOutlined />}>
                            Bəyannamələr
                            <NavLink to='/customs/declarations' />
                        </Menu.Item>
                        <Menu.Item key='/declarations/deleted' icon={<Icons.DeleteOutlined />}>
                            Silinmiş bəyannamələr
                            <NavLink to='/declarations/deleted' />
                        </Menu.Item>
                        <Menu.Item key='/customs/posts' icon={<Icons.AuditOutlined />}>
                            DGK Bağlamalar
                            <NavLink to='/customs/posts' />
                        </Menu.Item>
                        <Menu.Item key='/customs/tasks' icon={<Icons.AuditOutlined />}>
                            Gömrük tapşırıqları
                            <NavLink to='/customs/tasks' />
                        </Menu.Item>
                        <Menu.Item key='/declarations/post' icon={<Icons.FileTextOutlined />}>
                            Bəyan sonrası bağlamalar
                            <NavLink to='/declarations/post' />
                        </Menu.Item>
                        <Menu.Item key='/declarations/unknowns' icon={<Icons.QuestionCircleOutlined />}>
                            Naməlum bəyannamələr
                            <NavLink to='/declarations/unknowns' />
                        </Menu.Item>
                        <Menu.Item key='/declarations/partners' icon={<Icons.TeamOutlined />}>
                            Partnyor bəyannamələri
                            <NavLink to='/declarations/partners' />
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title='Növbələr'>
                        <Menu.Item key='/customs/dns-queues' icon={<Icons.OrderedListOutlined />}>
                            BBS növbələri
                            <NavLink to='/customs/dns-queues' />
                        </Menu.Item>
                        <Menu.Item key='/united-queues' icon={<Icons.DropboxOutlined />}>
                            United növbələri
                            <NavLink to='/united-queues' />
                        </Menu.Item>
                        <Menu.Item key='/azerpost-queues' icon={<Icons.DropboxOutlined />}>
                            Azərpoçt növbələri
                            <NavLink to='/azerpost-queues' />
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title='Bildirişlər'>
                        <Menu.Item key='/notifier/sms' icon={<Icons.TabletOutlined />}>
                            SMS Arxivi
                            <NavLink to='/notifier/sms' />
                        </Menu.Item>
                        <Menu.Item key='/notifier/whatsapp' icon={<Icons.WhatsAppOutlined />}>
                            Whatsapp Arxivi
                            <NavLink to='/notifier/whatsapp' />
                        </Menu.Item>
                        <Menu.Item key='/notifier/email' icon={<Icons.MailOutlined />}>
                            Mail Arxivi
                            <NavLink to='/notifier/email' />
                        </Menu.Item>
                        <Menu.Item key='/notifier/mobile/bulk/send' icon={<Icons.NotificationOutlined />}>
                            APP bildiriş
                            <NavLink to='/notifier/mobile/bulk/send' />
                        </Menu.Item>
                        <Menu.Item key='/notifier/templates' icon={<Icons.NotificationOutlined />}>
                            Bildiriş şablonları
                            <NavLink to='/notifier/templates' />
                        </Menu.Item>
                        <Menu.Item key='/ticket-templates' icon={<Icons.FileTextOutlined />}>
                            Müraciət şablonları
                            <NavLink to='/ticket-templates' />
                        </Menu.Item>
                    </Menu.ItemGroup>

                    <Menu.ItemGroup title='Məzmun'>
                        <Menu.Item key='/archive/state' icon={<Icons.HistoryOutlined />}>
                            Status Arxivi
                            <NavLink to='/archive/state' />
                        </Menu.Item>
                        <Menu.Item key='/logs' icon={<Icons.FileSearchOutlined />}>
                            Əməliyyat Arxivi
                            <NavLink to='/logs' />
                        </Menu.Item>
                        <Menu.Item key='/news' icon={<Icons.ReadOutlined />}>
                            Xəbərlər
                            <NavLink to='/news' />
                        </Menu.Item>
                        <Menu.Item key='/faq' icon={<Icons.QuestionCircleOutlined />}>
                            Tez-tez verilən suallar
                            <NavLink to='/faq' />
                        </Menu.Item>
                        <Menu.Item key='/shops' icon={<Icons.ShoppingOutlined />}>
                            Mağazalar
                            <NavLink to='/shops' />
                        </Menu.Item>
                        <Menu.Item key='/about' icon={<Icons.InfoCircleOutlined />}>
                            Haqqında
                            <NavLink to='/about' />
                        </Menu.Item>
                        <Menu.Item key='/transportation_conditions' icon={<Icons.CarOutlined />}>
                            Daşınma şərtləri
                            <NavLink to='/transportation_conditions' />
                        </Menu.Item>
                        <Menu.Item key='/banners' icon={<Icons.PictureOutlined />}>
                            Bannerlər
                            <NavLink to='/banners' />
                        </Menu.Item>
                        <Menu.Item key='/popups' icon={<Icons.NotificationOutlined />}>
                            Popuplar
                            <NavLink to='/popups' />
                        </Menu.Item>
                        <Menu.Item key='/delivery-proofs' icon={<Icons.FileProtectOutlined />}>
                            Təhvil sənədləri
                            <NavLink to='/delivery-proofs' />
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title='Proqram ayarları'>
                        <Menu.Item key='/settings' icon={<Icons.SettingOutlined />}>
                            Sistem ayarları
                            <NavLink to='/settings' />
                        </Menu.Item>
                        <Menu.Item key='/coupons' icon={<Icons.GiftOutlined />}>
                            Kuponlar
                            <NavLink to='/coupons' />
                        </Menu.Item>
                        <Menu.Item key='/refunds' icon={<Icons.RollbackOutlined />}>
                            İadələr
                            <NavLink to='/refunds' />
                        </Menu.Item>
                        <Menu.Item key='/cashback' icon={<Icons.SketchOutlined />}>
                            Kəşbəklər
                            <NavLink to='/cashback' />
                        </Menu.Item>
                        <Menu.Item key='/cargoes' icon={<Icons.CodeSandboxOutlined />}>
                            Xarici karqolar
                            <NavLink to='/cargoes' />
                        </Menu.Item>
                        <Menu.Item key='/boxes' icon={<Icons.InboxOutlined />}>
                            Yeşiklər
                            <NavLink to='/boxes' />
                        </Menu.Item>
                        <Menu.Item key='/shop-names' icon={<Icons.ShopOutlined />}>
                            Xarici mağazalar
                            <NavLink to='/shop-names' />
                        </Menu.Item>
                        <Menu.Item key='/return-types' icon={<Icons.RollbackOutlined />}>
                            İadə səbəbləri
                            <NavLink to='/return-types' />
                        </Menu.Item>
                        <Menu.Item key='/countries' icon={<Icons.GlobalOutlined />}>
                            Ölkələr
                            <NavLink to='/countries' />
                        </Menu.Item>
                        <Menu.Item key='/branches' icon={<Icons.BranchesOutlined />}>
                            Filiallar
                            <NavLink to='/branches' />
                        </Menu.Item>
                        <Menu.Item key='/branch-partners' icon={<Icons.BankOutlined />}>
                            Şirkətlər
                            <NavLink to='/branch-partners' />
                        </Menu.Item>
                        <Menu.Item key='/plans' icon={<Icons.TableOutlined />}>
                            Tariflər
                            <NavLink to='/plans' />
                        </Menu.Item>
                        <Menu.Item key='/product-types' icon={<Icons.AppstoreOutlined />}>
                            Məhsul tipləri
                            <NavLink to='/product-types' />
                        </Menu.Item>
                        <Menu.Item key='/regions' icon={<Icons.EnvironmentOutlined />}>
                            Rayonlar
                            <NavLink to='/regions' />
                        </Menu.Item>
                        <Menu.Item key='/models' icon={<Icons.ApartmentOutlined />}>
                            Modellər
                            <NavLink to='/models' />
                        </Menu.Item>
                        <Menu.Item key='/status' icon={<Icons.TagOutlined />}>
                            Statuslar
                            <NavLink to='/status' />
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title='Filial bölmələri'>
                        <Menu.Item key='/partner-boxes' icon={<Icons.InboxOutlined />}>
                            Yeşiklər
                            <NavLink to='/partner-boxes' />
                        </Menu.Item>
                        <Menu.Item key='/partner/acceptance/box' icon={<Icons.FileTextOutlined />}>
                            Bağlama qəbulu
                            <NavLink to='/partner/acceptance/box' />
                        </Menu.Item>
                        {can('branch_manager') && (
                            <Menu.Item key='/statistics/branches-partner' icon={<Icons.LineChartOutlined />}>
                                Yerli anbar statistikası
                                <NavLink to='/statistics/branches-partner' />
                            </Menu.Item>
                        )}
                    </Menu.ItemGroup>
                </Menu>
            </StyledSider>
            <SiderOverlay $visible={isOpen} onClick={toggleSidebar} />
        </React.Fragment>
    );
};
