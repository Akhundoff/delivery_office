import { FC } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { SearchCustomerPage, AppointmentPage } from '../pages';

const AppointmentLayout: FC = () => (
  <>
    <SearchCustomerPage />
    <Outlet />
  </>
);

const AppointmentPageRouter: FC = () => (
  <Routes>
    <Route element={<AppointmentLayout />}>
      <Route index element={null} />
      <Route path=":userId" element={<AppointmentPage />} />
    </Route>
  </Routes>
);

export default AppointmentPageRouter;
