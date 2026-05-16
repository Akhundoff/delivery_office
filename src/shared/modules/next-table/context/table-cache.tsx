import React, { createContext, FC, PropsWithChildren, useCallback, useMemo, useRef } from 'react';
import { NextTableState } from '../types';

export type TableCacheState = {
    set: (key: string, state: NextTableState) => void;
    get: (key: string) => NextTableState | undefined;
};

export const TableCacheContext = createContext<TableCacheState>({
    get: () => undefined,
    set: () => {},
});

export const TableCacheProvider: FC<PropsWithChildren> = ({ children }) => {
    const cacheRef = useRef<Record<string, NextTableState>>({});
    const set = useCallback((key: string, state: NextTableState) => { cacheRef.current[key] = state; }, []);
    const get = useCallback((key: string) => cacheRef.current[key], []);
    const value = useMemo(() => ({ set, get }), [get, set]);
    return <TableCacheContext.Provider value={value}>{children}</TableCacheContext.Provider>;
};
