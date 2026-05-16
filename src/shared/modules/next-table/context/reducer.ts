import { NextTableState } from '../types';
import { NextTableActions, NextTableActionTypes } from './action-types';

export const nextTableState: NextTableState = {
    pageIndex: 0,
    pageSize: 25,
    sortBy: [],
    filters: [],
    hiddenColumns: [],
    selectedRowIds: {},
    total: 0,
    loading: false,
    error: null,
    data: [],
    meta: {},
};

export const nextTableReducer = (state: NextTableState = nextTableState, action: NextTableActions): NextTableState => {
    switch (action.type) {
        case NextTableActionTypes.RESET:
            return { ...nextTableState, data: state.data };
        case NextTableActionTypes.SET_FILTERS:
            return { ...state, filters: action.filters };
        case NextTableActionTypes.SET_FILTER_BY_ID:
            const foundIndex = state.filters.findIndex((f) => f.id === action.id);
            if (foundIndex !== -1) {
                return { ...state, filters: state.filters.map((f, i) => (i === foundIndex ? { ...f, value: action.value } : f)) };
            }
            return { ...state, filters: [...state.filters, { id: action.id, value: action.value }] };
        case NextTableActionTypes.SET_SORT_BY:
            return { ...state, sortBy: action.sortBy };
        case NextTableActionTypes.SET_PAGE_INDEX:
            return { ...state, pageIndex: action.pageIndex };
        case NextTableActionTypes.SET_PAGE_SIZE:
            return { ...state, pageSize: action.pageSize };
        case NextTableActionTypes.SET_HIDDEN_COLUMNS:
            return { ...state, hiddenColumns: action.hiddenColumns };
        case NextTableActionTypes.SET_SELECTED_ROW_IDS:
            return { ...state, selectedRowIds: action.selectedRowIds };
        case NextTableActionTypes.SELECT_ALL:
            return { ...state, selectedRowIds: state.data.map(({ id }) => id).reduce((acc, val) => ({ ...acc, [val]: true }), {}) };
        case NextTableActionTypes.FETCHING_STARTED:
            return { ...state, loading: true, error: null };
        case NextTableActionTypes.FETCHING_SUCCEED:
            return { ...state, loading: false, error: null, data: action.data, total: action.total };
        case NextTableActionTypes.FETCHING_FAILED:
            return { ...state, loading: false, error: action.error || null };
        default:
            return state;
    }
};
