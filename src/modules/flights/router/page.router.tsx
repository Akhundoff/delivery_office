import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FlightsPage } from '../pages';

export const FlightsPageRouter: FC = () => (
  <Routes>
    <Route index element={<FlightsPage />} />
  </Routes>
);

export default FlightsPageRouter;
