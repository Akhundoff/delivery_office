import React, { Context, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { nextTableReducer, nextTableState } from './reducer';
import { NextTableContext, NextTableState } from '../types';
import {
    nextTableResetAction, nextTableSelectAllAction, nextTableSetFiltersAction,
    nextTableSetFiltersByIdAction, nextTableSetPageIndexAction, nextTableSetPageSizeAction,
    nextTableSetSelectedRowIdsAction, nextTableSetSortByAction,
} from './actions';
import { TableCacheContext } from './table-cache';
import { NextTableActions } from './action-types';
import { useDebounceEffect } from '@shared/hooks';

export const NextTableProvider: FC<PropsWithChildren<{
    context: Context<NextTableContext>;
    onFetch: Function;
    name?: string;
    useCache?: boolean;
    defaultState?: Partial<NextTableState>;
}>> = ({ children, context, onFetch, name, useCache = true, defaultState }) => {
    const tableCache = useContext(TableCacheContext);
    const cachedState = useMemo(() => (name && tableCache.get(name)) || {}, [name, tableCache]);
    const [state, baseDispatch] = useReducer(
        nextTableReducer,
        useCache ? { ...nextTableState, ...defaultState, ...cachedState } : { ...nextTableState, ...defaultState },
    );
    const mounted = useRef(true);

    const dispatch = useCallback<React.Dispatch<NextTableActions>>((action) => {
        if (mounted.current) baseDispatch(action);
    }, []);

    const handleChangeFilters = useCallback((filters) => dispatch(nextTableSetFiltersAction(filters)), [dispatch]);
    const handleChangeFilterById = useCallback((id: string, value: any) => dispatch(nextTableSetFiltersByIdAction(id, value)), [dispatch]);
    const handleChangeSortBy = useCallback((sortBy) => dispatch(nextTableSetSortByAction(sortBy)), [dispatch]);
    const handleChangePageIndex = useCallback((pageIndex) => dispatch(nextTableSetPageIndexAction(pageIndex)), [dispatch]);
    const handleChangePageSize = useCallback((pageSize) => dispatch(nextTableSetPageSizeAction(pageSize)), [dispatch]);
    const handleChangeSelectedRowIds = useCallback((selectedRowIds) => dispatch(nextTableSetSelectedRowIdsAction(selectedRowIds)), [dispatch]);

    const handleFetch = useCallback(() => {
        onFetch({ filters: state.filters, sortBy: state.sortBy, pageIndex: state.pageIndex, pageSize: state.pageSize })(dispatch);
    }, [dispatch, onFetch, state.filters, state.pageIndex, state.pageSize, state.sortBy]);

    const handleReset = useCallback(() => dispatch(nextTableResetAction()), [dispatch]);
    const handleSelectAll = useCallback(() => dispatch(nextTableSelectAllAction()), [dispatch]);
    const handleResetSelection = useCallback(() => dispatch(nextTableSetSelectedRowIdsAction({})), [dispatch]);

    useDebounceEffect(
        useCallback(() => { handleFetch(); }, [handleFetch]),
        300,    
    );

    useEffect(() => {
        if (name && useCache) tableCache.set(name, state);
    }, [name, useCache, tableCache, state]);

    useEffect(() => {
        return () => { mounted.current = false; };
    }, []);

    const value = useMemo<NextTableContext>(
        () => ({
            state, dispatch, handleChangeFilters, handleChangeSortBy, handleChangePageIndex,
            handleChangePageSize, handleChangeSelectedRowIds, handleFetch, handleReset,
            handleResetSelection, handleSelectAll, handleChangeFilterById,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state],
    );

    return <context.Provider value={value}>{children}</context.Provider>;
};
