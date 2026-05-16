import { SettingsContext } from '@modules/settings';
import React, { FC, useContext } from 'react';
import { CellProps } from 'react-table';

export const CountryCell: FC<CellProps<any>> = ({ cell: { value } }) => {
    const { getCountry } = useContext(SettingsContext);

    const country = value ? getCountry(value) : null;

    return <span>{country?.name ?? null}</span>;
};
