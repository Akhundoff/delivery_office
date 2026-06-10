import styled from "styled-components";
import { Card } from "antd";

export const PageContent = styled(Card).attrs({ size: 'small' })<{
  $contain?: boolean;
  $width?: string;
}>`
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
  max-width: ${({ $width = 'auto' }) => $width};

  & > .ant-card-body {
    display: flex;
    flex-direction: column;
    height: ${({ $contain }) => ($contain ? 'calc(100vh - 46px - 24px - 2px)' : 'auto')};
    min-height: ${({ $contain }) => ($contain ? '279px' : 'auto')};

    &:before {
      content: none;
    }

    & > *:not(:last-child) {
      margin-bottom: 12px;
    }
  }
`;
