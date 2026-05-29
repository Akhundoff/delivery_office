import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TransactionsPage } from '../pages';

export const TransactionsRouter: FC = () => (
  <Routes>
    <Route index element={<TransactionsPage />} />
  </Routes>
);

export default TransactionsRouter;
