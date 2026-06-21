import styled from 'styled-components';
import { Card, Descriptions } from 'antd';

export const HandoverItemInfo = styled(Descriptions)`
  margin-bottom: -12px;

  .ant-descriptions-item {
    padding: 0;
  }

  .ant-descriptions-item-label {
    font-weight: 600;
  }
`;

export const HandoverItemCard = styled(Card).attrs({ type: 'inner', size: 'small' })`
  .ant-card-extra {
    margin: -10px;
  }
`;

export const HandoverItemFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 4px;
  margin: 12px -8px -8px -8px;
`;
