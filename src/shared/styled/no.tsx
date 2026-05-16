import styled from 'styled-components';

const Button = styled.button`
  background: transparent;
  box-shadow: 0 0 0 transparent;
  border: 0 solid transparent;
  text-shadow: 0 0 0 transparent;
  padding: 0;
  margin: 0;

  &:hover {
    background: transparent;
    box-shadow: 0 0 0 transparent;
    border: 0 solid transparent;
    text-shadow: 0 0 0 transparent;
  }

  &:active {
    outline: none;
    border: none;
  }

  &:focus {
    outline: 0;
  }
`;

export const NoUI = { Button };
