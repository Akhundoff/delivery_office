import React, { Context, memo, useContext, useMemo } from 'react';
import { NextTableUI } from '../components';
import { NextTableContext } from '../types';

export const NextTable = memo<{
    context: Context<NextTableContext>;
    columns: any;
    getRowProps?: any;
    filterable?: boolean;
    sortable?: boolean;
    pagination?: boolean;
}>(({ context, columns, getRowProps, filterable, sortable, pagination }) => {
    const { state, handleChangeFilters, handleChangeSortBy, handleChangePageIndex, handleChangePageSize, handleChangeSelectedRowIds } =
        useContext<NextTableContext>(context);

    const controlledState = useMemo(
        () => ({
            filters: state.filters,
            sortBy: state.sortBy,
            pageSize: state.pageSize,
            pageIndex: state.pageIndex,
            hiddenColumns: state.hiddenColumns,
            selectedRowIds: state.selectedRowIds,
        }),
        [state.filters, state.sortBy, state.pageSize, state.pageIndex, state.hiddenColumns, state.selectedRowIds],
    );

    return (
        <NextTableUI
            columns={columns}
            data={state.data}
            total={state.total}
            state={controlledState}
            loading={state.loading}
            initialized={true}
            filterable={filterable}
            sortable={sortable}
            pagination={pagination}
            getRowProps={getRowProps}
            onChangeFilter={handleChangeFilters}
            onChangeSort={handleChangeSortBy}
            onChangePage={handleChangePageIndex}
            onChangePageSize={handleChangePageSize}
            onChangeSelectedRowIds={handleChangeSelectedRowIds}
        />
    );
});
