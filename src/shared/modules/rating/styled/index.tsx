import React from 'react';
import styled from 'styled-components';
import { StarFilled } from '@ant-design/icons';

export const StyledRating = styled.div`
  display: flex;
`;

export const StyledRatingItem = styled.div.attrs({ children: <StarFilled /> })<{ $active?: boolean }>`
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#ffae38' : '#face98')};
  font-size: 24px;
  padding: 0 0.125rem;

  &:hover {
    color: #ffae38;
  }
`;
