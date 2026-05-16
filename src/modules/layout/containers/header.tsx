import React from 'react';
import { Avatar, Dropdown, MenuProps, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { StyledHeader, StyledMenuFoldIcon, StyledMenuUnfoldIcon, StyledHeaderLeft, StyledHeaderRight, StyledHeaderButton, StyledPortalArea } from '../styled';
import { useHeader } from '../hooks';

export const AppHeader = () => {
    const { toggleSidebar, sidebarIsOpen, avatarText, logout, userName } = useHeader();

    const dropdownItems: MenuProps['items'] = [
        {
            key: 'user-info',
            label: userName,
            icon: <Icons.UserOutlined />,
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Çıxış',
            icon: <Icons.LogoutOutlined />,
            danger: true,
            onClick: logout,
        },
    ];

    return (
        <StyledHeader $wide={!sidebarIsOpen}>
            <StyledHeaderLeft>
                {sidebarIsOpen ? (
                    <StyledMenuFoldIcon onClick={toggleSidebar} />
                ) : (
                    <StyledMenuUnfoldIcon onClick={toggleSidebar} />
                )}
            </StyledHeaderLeft>
            <StyledPortalArea />
            <StyledHeaderRight>
                <Space size={8}>
                    <Dropdown menu={{ items: dropdownItems }} placement='bottomRight'>
                        <StyledHeaderButton type='text'>
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
