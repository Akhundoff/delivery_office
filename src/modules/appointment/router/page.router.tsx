import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SearchCustomerPage, AppointmentPage } from '../pages';

const AppointmentPageRouter: FC = () => (
    <Routes>
        <Route index element={<SearchCustomerPage />} />
        <Route path=':userId' element={<AppointmentPage />} />
    </Routes>
);

export default AppointmentPageRouter;
