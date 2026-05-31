import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { OrdersPage } from '../pages';
import { OrderDetailPage } from '../pages/detail';

const OrdersPageRouter: FC = () => (
  <Routes>
    <Route index element={<OrdersPage />} />
    <Route path=':id' element={<OrderDetailPage />} />
  </Routes>
);

export default OrdersPageRouter;
