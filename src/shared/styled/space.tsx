import styled from 'styled-components';

export const Space = styled.div<{ $size: number; $direction?: 'horizontal' | 'vertical' }>`
  display: ${({ $direction = 'vertical' }) => ($direction === 'vertical' ? 'block' : 'flex')};
  flex-wrap: wrap;

  [role='wrapped-button'] {
    white-space: normal;
    height: auto;
  }

  & > * {
    margin-right: ${({ $size, $direction = 'vertical' }) => $direction === 'horizontal' && $size}px;
    margin-bottom: ${({ $size, $direction = 'vertical' }) => $direction === 'vertical' && $size}px;
  }
`;
