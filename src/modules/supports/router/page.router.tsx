import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SupportsPage, SupportDetailsPage } from '../pages';

const SupportsPageRouter: FC = () => (
  <Routes>
    <Route index element={<SupportsPage />} />
    <Route path=":id" element={<SupportDetailsPage />} />
  </Routes>
);

export default SupportsPageRouter;
