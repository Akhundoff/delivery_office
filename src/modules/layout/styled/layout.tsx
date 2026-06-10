import styled from 'styled-components';
import { Layout } from 'antd';

export const StyledLayout = styled(Layout)<{ $wide?: boolean }>`
    margin-left: ${({ $wide }) => ($wide ? '46px' : '224px')};
    transition-delay: 0.3s;
`;

export const StyledContent = styled(Layout.Content)`
    min-height: calc(100vh - 46px);
    padding: 12px;
    margin-top: 46px;
`;
