import styled from 'styled-components';
import { Descriptions } from 'antd';

export const UserDescriptions = styled(Descriptions)`
  padding: 12px 12px 0 12px;
  border: 1px solid #f0f0f0;

  .ant-descriptions-item {
    padding: 0;
  }

  .ant-descriptions-item-label {
    font-weight: 600;
  }

  .ant-descriptions-item-content {
    margin-bottom: 12px;
  }
`;
