import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CouriersPage } from '../pages';
import { DelivererAssignmentsPage } from '../pages/deliverer-assignments';

const CouriersPageRouter: FC = () => (
    <Routes>
        <Route index element={<CouriersPage />} />
        <Route path='deliverer-assignments' element={<DelivererAssignmentsPage />} />
    </Routes>
);

export default CouriersPageRouter;
