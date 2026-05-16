import styled from 'styled-components';
import { rgba } from 'polished';
import { Theme } from '../theme';

export const FileLink = styled.a.attrs({ target: '_blank', rel: 'noreferrer noopener' })`
  font-size: 13px;
  display: inline-block;
  color: ${Theme.colors.primary};
  border: 1px solid ${Theme.colors.primary};
  background-color: ${rgba(Theme.colors.primary, 0.05)};
  border-radius: 2px;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.25rem;
  margin-right: 0.5rem;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    text-decoration: none;
    background-color: ${Theme.colors.primary};
    color: ${Theme.colors.white};
  }
`;
