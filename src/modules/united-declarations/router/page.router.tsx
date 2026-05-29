import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UnitedDeclarationsPage } from '../pages';

const UnitedDeclarationsPageRouter: FC = () => (
  <Routes>
    <Route index element={<UnitedDeclarationsPage />} />
  </Routes>
);

export default UnitedDeclarationsPageRouter;
