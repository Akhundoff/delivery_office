import React, { createContext, FC, PropsWithChildren, useCallback, useReducer } from 'react';
import { useBootstrapMeContext } from './hooks';
import { meContextReducer } from './reducer';
import { initialMeContextState } from './state';
import { IMeContext } from './types';

export const MeContext = createContext<IMeContext>({
    state: initialMeContextState,
    dispatch: () => null,
    can: () => false,
});

export const MeProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(meContextReducer, initialMeContextState);

    useBootstrapMeContext(state, dispatch);

    const can = useCallback((permission: string) => !!state.user.data?.permissions.includes(permission), [state.user.data?.permissions]);

    return <MeContext.Provider value={{ state, dispatch, can }}>{children}</MeContext.Provider>;
};
