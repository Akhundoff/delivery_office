import styled from 'styled-components';

export const CenteredContainer = styled.div<{ $maxWidth: string }>`
  max-width: ${({ $maxWidth = 'auto' }) => $maxWidth};
  width: 100%;
  margin: 0 auto;
`;
