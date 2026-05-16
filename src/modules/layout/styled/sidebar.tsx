import styled from 'styled-components';
import { Layout } from 'antd';
import { Theme } from '@shared/theme';

export const StyledSider = styled(Layout.Sider).attrs({ theme: 'dark' })`
    overflow: auto;
    height: 100vh;
    position: fixed;
    left: 0;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
    transform: translateX(-100%);
    background: ${Theme.colors.sidebarBg} !important;

    .ant-layout-sider-children {
        background: ${Theme.colors.sidebarBg};
    }

    .ant-menu.ant-menu-dark {
        background: ${Theme.colors.menuBg};
    }

    .ant-menu-dark .ant-menu-item-group-title {
        color: rgba(255, 255, 255, 0.45);
    }

    .ant-menu-dark .ant-menu-item:hover,
    .ant-menu-dark .ant-menu-item-active {
        border-radius: 0;
        background-color: ${Theme.colors.menuHoverItemBg} !important;
    }

    .ant-menu-dark.ant-menu-inline .ant-menu-item-selected,
    .ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item-selected {
        border-radius: 0;
        background-color: ${Theme.colors.menuActiveItemBg} !important;
    }

    .ant-menu-dark .ant-menu-submenu-title {
        border-radius: 0;
    }

    .ant-menu-dark .ant-menu-submenu-selected > .ant-menu-submenu-title,
    .ant-menu-dark .ant-menu-submenu-open > .ant-menu-submenu-title {
        border-radius: 0;
    }

    .ant-menu-dark .ant-menu-sub {
        background: ${Theme.colors.menuSubBg};
    }

    &.active {
        transform: translateX(0);
    }

    @media screen and (min-width: 992px) {
        .ant-menu-inline-collapsed {
            width: 46px;

            .ant-menu-item-group-title {
                display: none;
            }

            .ant-menu-item {
                padding: 0 15px;
            }
        }

        transform: translateX(0);
    }
    z-index: 1000;
`;

export const SiderOverlay = styled.div<{ $visible?: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
    z-index: 999;

    @media screen and (min-width: 992px) {
        opacity: 0;
        pointer-events: none;
    }
`;

export const Brand = styled.div`
    height: 46px;
    line-height: 46px;
    text-align: center;
    background-color: ${Theme.colors.sidebarBg};

    img {
        height: 24px;
    }
`;
