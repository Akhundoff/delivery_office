import React, { FC, useCallback, useMemo } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Constants } from '@shared/constants';

const { RangePicker } = DatePicker;

export const NextTableDateFilter: FC<any> = ({ column: { filterValue, setFilter } }) => {
    const value = useMemo(() => {
        if (filterValue) {
            return filterValue.split(',').map((date: string) => dayjs(date, Constants.DATE_TIME)) as any;
        }
        return undefined;
    }, [filterValue]);

    const handleChange = useCallback(
        (value: any) => {
            if (Array.isArray(value) && value.length === 2) {
                setFilter(value.map((d) => dayjs(d).format(Constants.DATE_TIME)).join(','));
            } else {
                setFilter(undefined);
            }
        },
        [setFilter],
    );

    return <RangePicker showTime={true} onChange={handleChange} value={value} format={Constants.DATE_TIME} />;
};
