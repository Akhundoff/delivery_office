import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { createContext, FC } from 'react';
import { useQuery } from 'react-query';
import { ISettings, SettingsApi } from '../interface';
import { SettingsService } from '../services/settings.service';

export const SettingsContext = createContext<ISettings>({
    data: {
        countries: [],
        warehouse: [],
        workinghours: '',
    },
    getCountryCode() {
        return '';
    },
    getCountryId() {
        return null;
    },
    getCountry() {
        return null;
    },
});

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
    const { data } = useQuery<SettingsApi | null>(
        'bootstrap-settings',
        useCallback(async () => {
            const response = await SettingsService.getSettings();
            return response.status === 200 ? response.data : null;
        }, []),
        useMemo(() => ({ refetchOnWindowFocus: false, retry: false }), []),
    );

    const getCountryId = useCallback(
        (country: string) => {
            if (data) {
                const found = data.countries.find((item) => item.abbr === country);
                if (found) {
                    return found.id;
                }
            }
            return null;
        },
        [data],
    );

    const getCountry = useCallback(
        (id: number | string) => {
            if (data) {
                const found = data.countries.find((item) => item.id.toString() === id.toString());
                if (found) {
                    return found;
                }
            }
            return null;
        },
        [data],
    );

    const getCountryCode = useCallback(
        (id: string | number | null) => {
            if (data && id) {
                const found = data.countries.find((item) => item.id.toString() === id.toString());
                if (found) {
                    return found.abbr;
                }
            }
            return '';
        },
        [data],
    );

    return <SettingsContext.Provider value={{ data: data ?? null, getCountryCode, getCountryId, getCountry }}>{children}</SettingsContext.Provider>;
};
