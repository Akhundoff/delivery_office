import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    StatisticsOverviewPage,
    DeclarationsByStatusPage,
    OrdersByStatusPage,
    OrdersByAdminPage,
    UsersCountsPage,
    CouriersCountsPage,
    CouriersByRegionsPage,
    CouriersByRegionsOverviewPage,
    TransactionsByUserPage,
    TransactionsByPaymentTypePage,
    PaymentTypesByDeclarationsPage,
    CashFlowTransactionsPage,
    TariffOverviewPage,
    QizilOnluqPage,
} from '../pages';

const StatisticsPageRouter: FC = () => (
    <Routes>
        <Route index element={<StatisticsOverviewPage />} />
        <Route path='declarations/by-status' element={<DeclarationsByStatusPage />} />
        <Route path='orders/by-status' element={<OrdersByStatusPage />} />
        <Route path='orders/by-admin' element={<OrdersByAdminPage />} />
        <Route path='users/counts' element={<UsersCountsPage />} />
        <Route path='couriers/counts' element={<CouriersCountsPage />} />
        <Route path='couriers/counts/by-regions' element={<CouriersByRegionsPage />} />
        <Route path='couriers/overview/counts/by-regions' element={<CouriersByRegionsOverviewPage />} />
        <Route path='transactions/by-user' element={<TransactionsByUserPage />} />
        <Route path='transactions/payment-counts/by-payment-types' element={<TransactionsByPaymentTypePage />} />
        <Route path='transactions/payment-types/by-declarations' element={<PaymentTypesByDeclarationsPage />} />
        <Route path='cashflow-transactions' element={<CashFlowTransactionsPage />} />
        <Route path='plans' element={<TariffOverviewPage />} />
        <Route path='qizil-onluq' element={<QizilOnluqPage />} />
    </Routes>
);

export default StatisticsPageRouter;
