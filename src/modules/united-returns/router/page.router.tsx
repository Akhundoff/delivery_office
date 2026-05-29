import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UnitedReturnsPage, UnitedReturnExecutionPage } from '../pages';

const UnitedReturnsPageRouter: FC = () => (
  <Routes>
    <Route index element={<UnitedReturnsPage />} />
    <Route path="execution" element={<UnitedReturnExecutionPage />} />
  </Routes>
);

export default UnitedReturnsPageRouter;
