import styled from 'styled-components';
import { Layout } from 'antd';

export const StyledContent = styled(Layout.Content) <{ $collapsed?: boolean }>`
    margin-left: 0;
    padding-top: 46px;
    min-height: 100vh;
    transition: margin-left 0.2s;
    background-color: #f0f2f5;

    @media screen and (min-width: 992px) {
        margin-left: ${({ $collapsed }) => ($collapsed ? '46px' : '224px')};
    }
`;
