import styled from 'styled-components';

export const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const Flex = styled.div<{ $expandNthChild?: number; $align?: string; $justify?: string }>`
  display: flex;
  align-items: ${({ $align = 'flex-start' }) => $align};
  justify-content: ${({ $justify = 'flex-start' }) => $justify};

  & > *:nth-child(${({ $expandNthChild = 1 }) => $expandNthChild}) {
    flex: 1;
  }
`;
