import React, { memo, useCallback, useMemo } from 'react';
import { Row } from 'react-table';
import { StyledNextTable } from '../styled';

type NextTableRowProps = { row: any; prepareRow: (row: Row<any>) => void; getRowProps?: Function; selected?: boolean; };

export const NextTableRow = memo<NextTableRowProps>(({ prepareRow, row, getRowProps }) => {
    prepareRow(row);
    const toggleRowSelectedProps = row.getToggleRowSelectedProps();
    const handleClick = useCallback(() => {
        toggleRowSelectedProps.onChange({ target: { checked: !toggleRowSelectedProps.checked } });
    }, [toggleRowSelectedProps]);
    const extraProps = useMemo(() => (getRowProps ? getRowProps(row.id, row.original) : {}), [getRowProps, row.id, row.original]);
    return (
        <StyledNextTable.Tr $selected={toggleRowSelectedProps.checked} {...row.getRowProps({ onClick: handleClick, ...extraProps })}>
            {row.cells.map((cell: any) => (
                <StyledNextTable.Td {...cell.getCellProps({ className: cell.column.className })}>{cell.render('Cell')}</StyledNextTable.Td>
            ))}
        </StyledNextTable.Tr>
    );
});
