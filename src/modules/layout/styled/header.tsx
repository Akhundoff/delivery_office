import { Button, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styled, { css } from 'styled-components';
import { Theme } from '@shared/theme';

export const StyledHeader = styled(Layout.Header) <{ $wide?: boolean }>`
    background: ${Theme.colors.sidebarBg} !important;
    height: 46px !important;
    line-height: 46px !important;
    padding: 0;
    display: flex;
    justify-content: space-between;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1;
    transition: left 0.2s;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);

    @media screen and (min-width: 992px) {
        left: ${({ $wide }) => ($wide ? '46px' : '224px')};
    }
`;

const HeaderIconStyles = css`
    color: rgba(255, 255, 255, 0.85);
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 18px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
`;

export const StyledMenuFoldIcon = styled(MenuFoldOutlined)`
    ${HeaderIconStyles}
`;

export const StyledMenuUnfoldIcon = styled(MenuUnfoldOutlined)`
    ${HeaderIconStyles}
`;

export const StyledHeaderLeft = styled.div`
    display: flex;
    align-items: center;
`;

export const StyledHeaderRight = styled.div`
    display: flex;
    align-items: center;
    padding-right: 8px;
`;

export const StyledPortalArea = styled.div.attrs({ id: 'app-header-portal-area' })`
    display: flex;
    align-items: center;
    flex: 1;
    padding: 0 8px;
    box-shadow: -18px 0 18px -30px rgba(0, 0, 0, 0.5) inset, 18px 0 18px -30px rgba(0, 0, 0, 0.5) inset;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
    }

    & > * {
        white-space: nowrap;
    }

    & > div {
        flex: 1;
    }
`;

export const StyledHeaderButton = styled(Button)`
    border: none;
    box-shadow: none;
    height: 46px;
    padding: 0 12px;
    background-color: transparent;
    color: rgba(255, 255, 255, 0.85);
    border-radius: 0;

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
        color: #fff;
    }

    &::after {
        content: none;
    }
`;
