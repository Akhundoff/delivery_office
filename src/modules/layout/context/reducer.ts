import { ILayoutState, LayoutAction } from './types';

export const layoutReducer = (state: ILayoutState, action: LayoutAction): ILayoutState => {
    switch (action.type) {
        case 'SET_SIDEBAR_IS_OPEN':
            return { ...state, sidebar: { ...state.sidebar, isOpen: action.payload } };
        default:
            return state;
    }
};
