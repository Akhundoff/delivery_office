import { FC } from 'react';
import styled from 'styled-components';
import { Tag } from 'antd';
import { CellProps } from 'react-table';

export const OverflowTag = styled(Tag)`
  margin: 0;

  &:not(:hover) {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    opacity: 1;
    z-index: 19;
  }
`;

export const TagCell: FC<CellProps<any>> = ({ cell: { value } }) => <OverflowTag>{value}</OverflowTag>;
