import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateOrder, OrderTimeline, RejectOrders } from '../containers';

const OrdersModalRouter: FC = () => (
  <Routes>
    <Route path='create' element={<CreateOrder />} />
    <Route path=':id/update' element={<CreateOrder />} />
    <Route path=':id/timeline' element={<OrderTimeline />} />
    <Route path=':id/reject' element={<RejectOrders />} />
    <Route path='bulk_reject' element={<RejectOrders />} />
  </Routes>
);

export default OrdersModalRouter;
