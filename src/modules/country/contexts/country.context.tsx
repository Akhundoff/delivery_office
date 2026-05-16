import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MeContext } from '@modules/me/context/context';
import { SettingsContext } from '@modules/settings';

export type CountryContextValue = [{ selected: string | null; available: string[] }, { onSelectedCountryChange: (value: string) => void }];

export const CountryContext = createContext<CountryContextValue>([{ selected: null, available: [] }, { onSelectedCountryChange: () => { } }]);

export const CountryProvider: FC<PropsWithChildren> = ({ children }) => {
    const { can } = useContext(MeContext);
    const settings = useContext(SettingsContext);

    const available = useMemo(() => {
        const countries: string[] = [];

        if (settings.data?.countries) {
            settings.data.countries.forEach((country) => {
                if (can(`warehouse_${country.abbr}`)) {
                    countries.push(country.abbr);
                }
            });
        }

        return countries;
    }, [can, settings.data]);

    const [selected, setSelected] = useState<string | null>(() => {
        const country = localStorage.getItem('warehouse.country');
        return country || null;
    });

    useEffect(() => {
        if (selected && settings.data) {
            const countryId = settings.getCountryId(selected);
            if (countryId !== null) {
                localStorage.setItem('warehouse.country_id', countryId.toString());
            }

            const country = countryId !== null ? settings.getCountry(countryId) : null;
            if (country) {
                localStorage.setItem('warehouse.measure', country.unit);
            }
        }
    }, [selected, settings]);

    const onSelectedCountryChange = useCallback((country: string) => {
        setSelected(country || null);
        localStorage.setItem('warehouse.country', country || '');
    }, []);

    const value = useMemo<CountryContextValue>(() => [{ selected, available }, { onSelectedCountryChange }], [available, onSelectedCountryChange, selected]);

    return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
};
