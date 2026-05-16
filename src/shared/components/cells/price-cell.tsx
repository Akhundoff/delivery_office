import React, { FC, memo } from 'react';

const TRY: FC<any> = ({ cell: { value } }) => (value ? <span>{value} &#8378;</span> : null);

const USD: FC<any> = ({ cell: { value } }) => (value ? <span>{value} &#36;</span> : null);

const AZN: FC<any> = ({ cell: { value } }) => (value ? <span>{value} &#8380;</span> : null);

const Auto: FC<any> = ({ cell: { value }, row: { original } }) => {
    switch (original.currency) {
        case 'TRY':
            return <span>{value} &#8378;</span>;
        case 'USD':
            return <span>{value} &#36;</span>;
        case 'AZN':
            return <span>{value} &#8380;</span>;
        default:
            return null;
    }
};

export const PriceCell = {
    TRY: memo<any>(TRY),
    USD: memo<any>(USD),
    AZN: memo<any>(AZN),
    Auto: memo<any>(Auto),
};
