import React, { FC, PropsWithChildren, useContext } from 'react';
import { LayoutContext } from '../context';
import { StyledLayout, StyledContent } from '../styled';
import { AppHeader } from './header';

export const AppContent: FC<PropsWithChildren> = ({ children }) => {
    const { state } = useContext(LayoutContext);

    return (
        <StyledLayout $wide={!state.sidebar.isOpen}>
            <AppHeader />
            <StyledContent>{children}</StyledContent>
        </StyledLayout>
    );
};
