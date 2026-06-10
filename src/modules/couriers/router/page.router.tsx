import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CouriersPage, CourierDetailPage } from '../pages';
import { DelivererAssignmentsPage } from '../pages/deliverer-assignments';

const CouriersPageRouter: FC = () => (
    <Routes>
        <Route index element={<CouriersPage />} />
        <Route path='deliverer-assignments' element={<DelivererAssignmentsPage />} />
        <Route path=':id' element={<CourierDetailPage />} />
    </Routes>
);

export default CouriersPageRouter;
