import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CashbackTransactionsDetailsPage } from '../pages/transactions-details';

export const CashbacksModalRouter: FC = () => (
  <Routes>
    <Route path=":cashbackId" element={<CashbackTransactionsDetailsPage />} />
  </Routes>
);

export default CashbacksModalRouter;
