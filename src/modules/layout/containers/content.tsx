import React, { FC, PropsWithChildren, useContext } from 'react';
import { LayoutContext } from '../context';
import { StyledContent } from '../styled';

export const AppContent: FC<PropsWithChildren> = ({ children }) => {
    const { state } = useContext(LayoutContext);

    return <StyledContent $collapsed={!state.sidebar.isOpen}>{children}</StyledContent>;
};
