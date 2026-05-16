import styled, { css } from 'styled-components';
import { Tabs } from 'antd';
import { TabsPosition } from 'antd/es/tabs';

const tabPositionLeftStyle = css`
  border: 1px solid #f0f0f0;
  background-color: #fafafa;

  .ant-tabs-nav {
    background-color: #fafafa;
    max-width: 340px;
    border-right: 1px solid #f0f0f0;
  }

  .ant-tabs-tabpane {
    padding-left: 0 !important;
  }

  .ant-tabs-tab {
    margin-bottom: 0 !important;

    .ant-tabs-tab-btn {
      text-align: left;
      white-space: normal;
    }

    &:not(:nth-last-child(2)) {
      border-bottom: 1px solid #f0f0f0;
    }
  }
`;

const tabPositionTopStyle = css`
  .ant-tabs-nav {
    border-left: 1px solid #f0f0f0;
    border-top: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
    background-color: #fafafa;
  }

  .ant-tabs-tab {
    padding-left: 12px;
    padding-right: 12px;
    margin-right: 0;
  }

  .ant-tabs-extra-content > .ant-btn-icon-only {
    min-width: 42px;
  }
`;

export const StyledTabs = styled(Tabs)<{ tabPosition?: TabsPosition }>`
  min-height: 256px;

  ${({ tabPosition = 'top' }) => {
    switch (tabPosition) {
      case 'left':
        return tabPositionLeftStyle;
      case 'top':
        return tabPositionTopStyle;
      default:
        return css``;
    }
  }}
`;
