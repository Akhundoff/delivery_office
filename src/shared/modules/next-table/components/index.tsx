import { memo, useCallback, useEffect, useMemo } from 'react';
import { TableOptions, useFilters, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { Result, Spin } from 'antd';
import { NextTableWrapper } from './wrapper';
import { NextTableHead } from './head';
import { NextTableBody } from './body';
import { NextTableDefaultFilter } from './filters/default';
import { NextTablePagination } from './pagination';
import { useNextTableFlexLayout } from '../hooks';
import { NextTableProps } from '../types';
import { StyledNextTable } from '../styled';

export const NextTableUI = memo<NextTableProps>(
    ({
        columns, data, total, state, loading, error,
        filterable = true, sortable = true, pagination = true,
        onChangePage, onChangePageSize, onChangeSort, onChangeFilter, onChangeSelectedRowIds, getRowProps,
    }) => {
        const pageOptions = useMemo(() => ['5', '10', '15', '25', '50'], []);
        const selectedRowIds = useMemo(() => state?.selectedRowIds, [state]);
        const gotoPageAction = useCallback((pageIndex = 0) => onChangePage?.(pageIndex), [onChangePage]);
        const setPageSizeAction = useCallback((pageSize = 0) => onChangePageSize?.(pageSize), [onChangePageSize]);
        const toggleSortByAction = useCallback((sortBy: any) => onChangeSort?.(sortBy), [onChangeSort]);
        const setFilterAction = useCallback((filters: any) => onChangeFilter?.(filters), [onChangeFilter]);
        const setSelectedRowIdsAction = useCallback((ids: any) => onChangeSelectedRowIds?.(ids), [onChangeSelectedRowIds]);

        const stateReducer = useCallback(
            (state: any, action: any) => {
                if (action.type === 'setState') return { ...action.state };
                setTimeout(() => {
                    switch (action.type) {
                        case 'resetPage': case 'gotoPage': gotoPageAction(action.pageIndex); break;
                        case 'setPageSize': setPageSizeAction(action.pageSize); break;
                        case 'toggleSortBy': toggleSortByAction(state.sortBy); break;
                        case 'setFilter': setFilterAction(state.filters); break;
                        case 'toggleRowSelected': setSelectedRowIdsAction(state.selectedRowIds); break;
                        case 'resetSelectedRows': setSelectedRowIdsAction({}); break;
                    }
                }, 1);
                return state;
            },
            [gotoPageAction, setPageSizeAction, toggleSortByAction, setFilterAction, setSelectedRowIdsAction],
        );

        const defaultColumn = useMemo<any>(() => ({ Filter: NextTableDefaultFilter, filterable, sortable, width: 200 }), [filterable, sortable]);
        const handleGetRowId = useCallback((row: any) => row.id, []);

        const tableOptions = useMemo<TableOptions<any>>(
            () => ({ columns, data, defaultColumn, getRowId: handleGetRowId, stateReducer, useControlledState: () => state, manualFilters: true, manualSortBy: true, manualPagination: pagination }),
            [columns, data, defaultColumn, handleGetRowId, state, stateReducer, pagination],
        );

        const tablePlugins = useMemo(() => [useFilters, useSortBy, usePagination, useRowSelect, useNextTableFlexLayout], []);
        const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, dispatch, gotoPage, setPageSize }: any = useTable(tableOptions, ...tablePlugins);

        useEffect(() => { dispatch({ type: 'setState', state }); }, [state, dispatch]);

        return (
            <NextTableWrapper
                getTableProps={getTableProps}
                paginationArea={
                    <NextTablePagination total={total} pageIndex={state.pageIndex} pageOptions={pageOptions} pageSize={state.pageSize} gotoPage={gotoPage} setPageSize={setPageSize} />
                }
            >
                <NextTableHead filterable={filterable} headerGroups={headerGroups} />
                <NextTableBody getRowProps={getRowProps} getTableBodyProps={getTableBodyProps} selectedRowIds={selectedRowIds} prepareRow={prepareRow} rows={page} />
                <StyledNextTable.Result $visible={loading}><Spin /></StyledNextTable.Result>
                <StyledNextTable.Result $visible={!loading && !!error}><Result status='warning' title={error} /></StyledNextTable.Result>
            </NextTableWrapper>
        );
    },
);
