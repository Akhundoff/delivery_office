import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CashFlowOverviewPage, CurrenciesPage, CashRegistersPage, CashRegisterOperationsPage, CashFlowTransactionsPage, CashFlowAnalyticsPage, CashFlowTransactionDetailsPage } from '../pages';

const CashFlowPageRouter: FC = () => (
    <Routes>
        <Route index element={<CashFlowOverviewPage />} />
        <Route path='currencies' element={<CurrenciesPage />} />
        <Route path='cash-registers' element={<CashRegistersPage />} />
        <Route path='operations' element={<CashRegisterOperationsPage />} />
        <Route path='transactions/:id' element={<CashFlowTransactionDetailsPage />} />
        <Route path='transactions' element={<CashFlowTransactionsPage />} />
        <Route path='analytics' element={<CashFlowAnalyticsPage />} />
    </Routes>
);

export default CashFlowPageRouter;
