import { createContext } from 'react';
import { nextTableState } from './reducer';
import { NextTableContext } from '../types';

export const createNextTableContext = () =>
    createContext<NextTableContext>({
        state: nextTableState,
        dispatch: () => null,
        handleChangeFilters: () => null,
        handleChangePageIndex: () => null,
        handleChangePageSize: () => null,
        handleChangeSelectedRowIds: () => null,
        handleChangeSortBy: () => null,
        handleFetch: () => null,
        handleReset: () => null,
        handleResetSelection: () => null,
        handleChangeFilterById: () => null,
        handleSelectAll: () => null,
    });
