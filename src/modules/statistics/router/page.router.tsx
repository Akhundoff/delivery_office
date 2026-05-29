import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { StatisticsOverviewPage, DeclarationsByStatusPage, OrdersByStatusPage, TransactionsByUserPage } from '../pages';

const StatisticsPageRouter: FC = () => (
    <Routes>
        <Route index element={<StatisticsOverviewPage />} />
        <Route path='declarations/by-status' element={<DeclarationsByStatusPage />} />
        <Route path='orders/by-status' element={<OrdersByStatusPage />} />
        <Route path='transactions/by-user' element={<TransactionsByUserPage />} />
    </Routes>
);

export default StatisticsPageRouter;
