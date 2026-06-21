import React from 'react';
import { Avatar, Dropdown, MenuProps, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { CustomsStatus } from '@modules/customs';
import { useCashRegisterBalance } from '@modules/cash-flow';
import { StyledHeader, StyledMenuFoldIcon, StyledMenuUnfoldIcon, StyledHeaderLeft, StyledHeaderRight, StyledHeaderButton, StyledPortalArea } from '../styled';
import { useHeader } from '../hooks';
import { QuickSearch } from './quick-search';

export const AppHeader = () => {
  const { toggleSidebar, sidebarIsOpen, avatarText, logout } = useHeader();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const cashRegisterBalance = useCashRegisterBalance({ enabled: dropdownOpen });

  const dropdownItems: MenuProps['items'] = [
    ...(cashRegisterBalance.data
      ? [
          {
            key: 'cash-register-balance',
            label: `${cashRegisterBalance.data.name}: ${cashRegisterBalance.data.amount} ${cashRegisterBalance.data.currency.code}`,
            icon: <Icons.MoneyCollectOutlined />,
            disabled: true,
            style: { color: 'black' },
          } as const,
        ]
      : []),
    {
      key: 'logout',
      label: 'Çıxış',
      icon: <Icons.LogoutOutlined />,
      onClick: logout,
    },
  ];

  return (
    <StyledHeader $wide={!sidebarIsOpen}>
      <StyledHeaderLeft>{sidebarIsOpen ? <StyledMenuFoldIcon onClick={toggleSidebar} /> : <StyledMenuUnfoldIcon onClick={toggleSidebar} />}</StyledHeaderLeft>
      <StyledPortalArea />
      <StyledHeaderRight>
        <QuickSearch />
        <Space size={8}>
          <CustomsStatus />
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" onOpenChange={setDropdownOpen}>
            <StyledHeaderButton type="text">
              <Avatar size={28} style={{ backgroundColor: '#52c41a', fontSize: 13 }}>
                {avatarText}
              </Avatar>
            </StyledHeaderButton>
          </Dropdown>
        </Space>
      </StyledHeaderRight>
    </StyledHeader>
  );
};
