import React, { memo } from 'react';
import { Row, TableBodyPropGetter, TableBodyProps } from 'react-table';
import { NextTableRow } from './row';
import { StyledNextTable } from '../styled';

type ITableBodyProps = {
    getTableBodyProps: (propGetter?: TableBodyPropGetter<any>) => TableBodyProps;
    rows: Row[];
    prepareRow: (row: Row<any>) => void;
    selectedRowIds: Record<string | number, true>;
    getRowProps?: Function;
};

export const NextTableBody = memo<ITableBodyProps>(({ getTableBodyProps, rows, prepareRow, selectedRowIds, getRowProps }) => {
    return (
        <StyledNextTable.TBody {...getTableBodyProps()}>
            {rows.map((row: any) => (
                <NextTableRow selected={selectedRowIds[row.id]} key={row.id} getRowProps={getRowProps} prepareRow={prepareRow} row={row} />
            ))}
        </StyledNextTable.TBody>
    );
});
