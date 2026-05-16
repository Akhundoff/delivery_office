import React, { FC, PropsWithChildren, useReducer } from 'react';
import { LayoutContext } from './context';
import { initialLayoutState } from './state';
import { layoutReducer } from './reducer';

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(layoutReducer, initialLayoutState);

    return <LayoutContext.Provider value={{ state, dispatch }}>{children}</LayoutContext.Provider>;
};
