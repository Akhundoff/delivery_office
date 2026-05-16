import {
    NextTableResetAction, NextTableSetFiltersAction, NextTableSetFilterByIdAction,
    NextTableSetSortByAction, NextTableSetPageIndexAction, NextTableSetPageSizeAction,
    NextTableSetHiddenColumnsAction, NextTableSetSelectedRowIdsAction, NextTableSelectAllAction,
    NextTableFetchingStartedAction, NextTableFetchingSucceedAction, NextTableFetchingFailedAction,
    NextTableActionTypes,
} from './action-types';

export const nextTableResetAction = (): NextTableResetAction => ({ type: NextTableActionTypes.RESET });
export const nextTableSetFiltersAction = (filters: any[]): NextTableSetFiltersAction => ({ type: NextTableActionTypes.SET_FILTERS, filters });
export const nextTableSetFiltersByIdAction = (id: string, value: any): NextTableSetFilterByIdAction => ({ type: NextTableActionTypes.SET_FILTER_BY_ID, id, value });
export const nextTableSetSortByAction = (sortBy: any[]): NextTableSetSortByAction => ({ type: NextTableActionTypes.SET_SORT_BY, sortBy });
export const nextTableSetPageIndexAction = (pageIndex: number): NextTableSetPageIndexAction => ({ type: NextTableActionTypes.SET_PAGE_INDEX, pageIndex });
export const nextTableSetPageSizeAction = (pageSize: number): NextTableSetPageSizeAction => ({ type: NextTableActionTypes.SET_PAGE_SIZE, pageSize });
export const nextTableSetHiddenColumns = (hiddenColumns: string[]): NextTableSetHiddenColumnsAction => ({ type: NextTableActionTypes.SET_HIDDEN_COLUMNS, hiddenColumns });
export const nextTableSetSelectedRowIdsAction = (selectedRowIds: Record<string | number, true>): NextTableSetSelectedRowIdsAction => ({ type: NextTableActionTypes.SET_SELECTED_ROW_IDS, selectedRowIds });
export const nextTableSelectAllAction = (): NextTableSelectAllAction => ({ type: NextTableActionTypes.SELECT_ALL });
export const nextTableFetchDataStartedAction = (): NextTableFetchingStartedAction => ({ type: NextTableActionTypes.FETCHING_STARTED });
export const nextTableFetchDataSucceedAction = ({ total, data, meta }: { total: number; data: any[]; meta?: Record<string, any> }): NextTableFetchingSucceedAction => ({ type: NextTableActionTypes.FETCHING_SUCCEED, total, data, meta });
export const nextTableFetchDataFailedAction = (error?: string): NextTableFetchingFailedAction => ({ type: NextTableActionTypes.FETCHING_FAILED, error });
