import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { CellProps } from 'react-table';

export const Overflow = styled.div<{ $expand?: boolean }>`
    white-space: nowrap;
    transition: padding 0.2s;
    overflow: hidden;
    text-overflow: ellipsis;

    ${({ $expand = true }) =>
        $expand &&
        css`
            &:hover {
                padding: 0 8px;
                background-color: #ffffff;
                opacity: 1;
                z-index: 19;
                overflow: unset;
                text-overflow: unset;
            }
        `}
`;

export const OverCell: FC<CellProps<any>> = ({ cell: { value } }) => <Overflow>{value}</Overflow>;


