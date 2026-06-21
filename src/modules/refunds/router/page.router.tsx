import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RefundsPage } from '../pages';
import { RefundDetailsPage } from '../pages/refund-details';

export const RefundsRouter: FC = () => (
  <Routes>
    <Route index element={<RefundsPage />} />
    <Route path=":id/info" element={<RefundDetailsPage />} />
  </Routes>
);

export default RefundsRouter;
