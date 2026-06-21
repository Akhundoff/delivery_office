import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

const CreateCourierPage = React.lazy(() => import('../containers/create-courier').then((m) => ({ default: m.CreateCourier })));
const CourierTimelinePage = React.lazy(() => import('../containers/courier-timeline').then((m) => ({ default: m.CourierTimeline })));
const HandoverCouriersPage = React.lazy(() => import('../containers/handover-couriers').then((m) => ({ default: m.HandoverCouriers })));
const AssignDelivererPage = React.lazy(() => import('../containers/assign-deliverer').then((m) => ({ default: m.AssignDeliverer })));
const CancelDelivererPage = React.lazy(() => import('../containers/cancel-deliverer').then((m) => ({ default: m.CancelDeliverer })));

const CouriersModalRouter: FC = () => (
  <React.Suspense fallback={null}>
    <Routes>
      <Route path="create" element={<CreateCourierPage />} />
      <Route path=":id/update" element={<CreateCourierPage />} />
      <Route path=":id/timeline" element={<CourierTimelinePage />} />
      <Route path=":id/handover" element={<HandoverCouriersPage />} />
      <Route path=":id/assign-deliverer" element={<AssignDelivererPage />} />
      <Route path="deliverer-assignments/cancel" element={<CancelDelivererPage />} />
    </Routes>
  </React.Suspense>
);

export default CouriersModalRouter;
