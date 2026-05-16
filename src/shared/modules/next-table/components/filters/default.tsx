import React, { FC, useCallback, useEffect, useState, forwardRef } from 'react';
import { Input } from 'antd';

export const NextTableDefaultFilter: FC<any> = forwardRef<any, any>(({ column: { filterValue, setFilter } }, _ref) => {
    const [focused, setFocused] = useState(false);
    const [currentValue, setCurrentValue] = useState(filterValue);

    const handleKeyUp = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') setFilter(currentValue);
        },
        [setFilter, currentValue],
    );

    useEffect(() => { setCurrentValue(filterValue); }, [filterValue]);

    return (
        <Input
            value={focused ? currentValue : filterValue}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyUp={handleKeyUp}
        />
    );
});
