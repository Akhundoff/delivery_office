import React, { FC, PropsWithChildren } from 'react';
import { Layout } from 'antd';
import { LayoutProvider } from '../context';
import { AppSidebar } from './sidebar';
import { AppHeader } from './header';
import { AppContent } from './content';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <LayoutProvider>
            <Layout style={{ minHeight: '100vh' }}>
                <AppSidebar />
                <Layout>
                    <AppHeader />
                    <AppContent>{children}</AppContent>
                </Layout>
            </Layout>
        </LayoutProvider>
    );
};
