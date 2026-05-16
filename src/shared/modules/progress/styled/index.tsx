import { Card, Typography } from 'antd';
import styled from 'styled-components';

const Wrapper = styled(Card).attrs({ size: 'small' })``;

const Text = styled.div<{ $last?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ $last }) => ($last ? 0 : '12px')};
`;

const Paragraph = styled(Typography.Paragraph)`
  margin-bottom: 0 !important;
`;

const Title = styled(Typography.Title)`
  margin-bottom: 0 !important;
  line-height: 30px !important;
`;

export const StyledProgress = { Wrapper, Text, Paragraph, Title };
