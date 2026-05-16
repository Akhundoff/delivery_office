import React, { FC, useCallback } from 'react';
import { Checkbox } from 'antd';

export const NextTableCheckboxFilter: FC<any> = ({ column: { filterValue, setFilter } }) => {
    const handleChange = useCallback(() => {
        switch (filterValue) {
            case '1':
                setFilter(undefined);
                break;
            case '0':
                setFilter('1');
                break;
            default:
                setFilter('0');
        }
    }, [filterValue, setFilter]);

    return <Checkbox onChange={handleChange} indeterminate={filterValue === '0'} checked={filterValue === '1'} />;
};
