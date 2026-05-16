export enum NextTableActionTypes {
    RESET = '@table/reset',
    SET_FILTERS = '@table/set/filters',
    SET_FILTER_BY_ID = '@table/set/filters/byId',
    SET_SORT_BY = '@table/set/sortBy',
    SET_PAGE_INDEX = '@table/set/pageIndex',
    SET_PAGE_SIZE = '@table/set/pageSize',
    SET_SELECTED_ROW_IDS = '@table/set/selectedRowIds',
    SET_HIDDEN_COLUMNS = '@table/set/hiddenColumns',
    SELECT_ALL = '@table/set/selectAll',
    FETCHING_STARTED = '@table/fetching/started',
    FETCHING_SUCCEED = '@table/fetching/succeed',
    FETCHING_FAILED = '@table/fetching/failed',
}

export interface NextTableResetAction { type: NextTableActionTypes.RESET; }
export interface NextTableSetFiltersAction { type: NextTableActionTypes.SET_FILTERS; filters: any[]; }
export interface NextTableSetFilterByIdAction { type: NextTableActionTypes.SET_FILTER_BY_ID; id: string; value: any; }
export interface NextTableSetSortByAction { type: NextTableActionTypes.SET_SORT_BY; sortBy: any[]; }
export interface NextTableSetPageIndexAction { type: NextTableActionTypes.SET_PAGE_INDEX; pageIndex: number; }
export interface NextTableSetPageSizeAction { type: NextTableActionTypes.SET_PAGE_SIZE; pageSize: number; }
export interface NextTableSetHiddenColumnsAction { type: NextTableActionTypes.SET_HIDDEN_COLUMNS; hiddenColumns: string[]; }
export interface NextTableSetSelectedRowIdsAction { type: NextTableActionTypes.SET_SELECTED_ROW_IDS; selectedRowIds: Record<string | number, true>; }
export interface NextTableSelectAllAction { type: NextTableActionTypes.SELECT_ALL; }
export interface NextTableFetchingStartedAction { type: NextTableActionTypes.FETCHING_STARTED; }
export interface NextTableFetchingSucceedAction { type: NextTableActionTypes.FETCHING_SUCCEED; data: any[]; total: number; meta?: Record<string, any>; }
export interface NextTableFetchingFailedAction { type: NextTableActionTypes.FETCHING_FAILED; error: string | undefined; }

export type NextTableActions =
    | NextTableResetAction
    | NextTableFetchingStartedAction
    | NextTableFetchingSucceedAction
    | NextTableFetchingFailedAction
    | NextTableSetFiltersAction
    | NextTableSetFilterByIdAction
    | NextTableSetSortByAction
    | NextTableSetPageIndexAction
    | NextTableSetPageSizeAction
    | NextTableSetHiddenColumnsAction
    | NextTableSetSelectedRowIdsAction
    | NextTableSelectAllAction;
