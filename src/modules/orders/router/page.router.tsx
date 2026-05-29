import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { OrdersPage } from '../pages';

const OrdersPageRouter: FC = () => (
  <Routes>
    <Route index element={<OrdersPage />} />
  </Routes>
);

export default OrdersPageRouter;
