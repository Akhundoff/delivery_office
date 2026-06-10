import React, { FC, PropsWithChildren } from 'react';
import { Layout } from 'antd';
import { LayoutProvider } from '../context';
import { AppSidebar } from './sidebar';
import { AppContent } from './content';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <LayoutProvider>
            <Layout>
                <AppSidebar />
                <AppContent>{children}</AppContent>
            </Layout>
        </LayoutProvider>
    );
};
