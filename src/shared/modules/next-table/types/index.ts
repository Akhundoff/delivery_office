import { Dispatch } from 'react';
import { NextTableActions } from '../context/action-types';

export interface NextTableState {
    pageIndex: number;
    pageSize: number;
    sortBy: { id: string; desc: boolean }[];
    filters: { id: string | number; value: any }[];
    hiddenColumns: string[];
    selectedRowIds: Record<number | string, boolean>;
    data: (Record<string, any> & { id: number | string })[];
    total: number;
    loading: boolean;
    error: string | null;
    meta: Record<string, any>;
}

export type NextTableContext = {
    state: NextTableState;
    dispatch: Dispatch<NextTableActions>;
    handleChangePageIndex: any;
    handleChangePageSize: any;
    handleChangeSortBy: any;
    handleChangeFilters: any;
    handleChangeSelectedRowIds: any;
    handleFetch: any;
    handleReset: any;
    handleResetSelection: any;
    handleSelectAll: any;
    handleChangeFilterById: any;
};

export type NextTableProps = {
    columns: any[];
    data: any[];
    total: number;
    state?: any;
    filterable?: boolean;
    sortable?: boolean;
    pagination?: boolean;
    loading?: boolean;
    error?: string;
    initialized: boolean;
    onChangePage?: Function;
    onChangePageSize?: Function;
    onChangeSort?: Function;
    onChangeFilter?: Function;
    onChangeSelectedRowIds?: Function;
    onFetch?: Function;
    getRowProps?: Function;
};

export type NextTableFetchParams = Pick<NextTableState, 'filters' | 'sortBy' | 'pageIndex' | 'pageSize'>;
