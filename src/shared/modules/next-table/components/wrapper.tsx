import React, { memo } from 'react';
import { StyledNextTable } from '../styled';

type ITableWrapperProps = {
    getTableProps: Function;
    paginationArea: React.ReactNode;
    children: React.ReactNode;
};

export const NextTableWrapper = memo<ITableWrapperProps>(({ getTableProps, paginationArea, ...rest }) => {
    return (
        <StyledNextTable.Outer>
            <StyledNextTable.Wrapper className='next-table-wrapper'>
                <StyledNextTable.Table {...rest} {...getTableProps()} />
            </StyledNextTable.Wrapper>
            {paginationArea}
        </StyledNextTable.Outer>
    );
});
