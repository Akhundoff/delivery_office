import React, { FC } from 'react';
import { HeaderGroup } from 'react-table';
import { NextTableSorter } from './sorter';
import { StyledNextTable } from '../styled';

type ITableHeadProps = { headerGroups: HeaderGroup[]; filterable: boolean; };

export const NextTableHead: FC<ITableHeadProps> = ({ headerGroups, filterable }) => {
    return (
        <StyledNextTable.Thead>
            {headerGroups.map((headerGroup) => (
                <StyledNextTable.Tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column: any) => (
                        <StyledNextTable.Th {...column.getHeaderProps(column.sortable ? column.getSortByToggleProps() : {})}>
                            {column.render('Header')}
                            {column.sortable && <NextTableSorter dir={column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : undefined} />}
                        </StyledNextTable.Th>
                    ))}
                </StyledNextTable.Tr>
            ))}
            {filterable &&
                headerGroups.map((headerGroup) => (
                    <StyledNextTable.Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column: any) => (
                            <StyledNextTable.Th {...column.getHeaderProps()}>
                                {column.filterable ? column.render('Filter') : null}
                            </StyledNextTable.Th>
                        ))}
                    </StyledNextTable.Tr>
                ))}
        </StyledNextTable.Thead>
    );
};
