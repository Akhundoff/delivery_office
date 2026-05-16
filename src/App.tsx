import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import antLocaleAz from 'antd/lib/locale/az_AZ';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CountryProvider } from './modules/country';
import { MeProvider } from './modules/me';
import { SettingsProvider } from './modules/settings';
import { MainRouter } from './router';
import { TableCacheProvider } from './shared/modules/next-table/context/table-cache';

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } } });

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ConfigProvider locale={antLocaleAz}>
                    <TableCacheProvider>
                        <MeProvider>
                            <SettingsProvider>
                                <CountryProvider>
                                    <MainRouter />
                                </CountryProvider>
                            </SettingsProvider>
                        </MeProvider>
                    </TableCacheProvider>
                </ConfigProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
