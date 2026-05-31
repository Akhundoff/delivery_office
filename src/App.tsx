import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import antLocaleAz from 'antd/lib/locale/az_AZ';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CounterProvider } from './modules/counter';
import { CountryProvider } from './modules/country';
import { MeProvider } from './modules/me';
import { NotificationProvider } from './modules/notifications';
import { SettingsProvider } from './modules/settings';
import { MainRouter } from './router';
import { TableCacheProvider } from './shared/modules/next-table/context/table-cache';

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } } });

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ConfigProvider locale={antLocaleAz}>
                    <NotificationProvider>
                        <TableCacheProvider>
                            <MeProvider>
                                <SettingsProvider>
                                    <CountryProvider>
                                        <CounterProvider>
                                            <MainRouter />
                                        </CounterProvider>
                                    </CountryProvider>
                                </SettingsProvider>
                            </MeProvider>
                        </TableCacheProvider>
                    </NotificationProvider>
                </ConfigProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
