import styled from 'styled-components';
import { PageContainer } from '@ant-design/pro-components';

export const StyledPageHeader = styled(PageContainer)`
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;

  .ant-page-header-heading-left,
  .ant-page-header-heading-extra {
    margin: 0;
  }

  .ant-page-header-heading-title {
    font-size: 16px;
    font-weight: 500;
  }

  .ant-page-header-heading-extra > * {
    margin-left: 0;
  }
`;
