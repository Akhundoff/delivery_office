import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateFlight } from '../containers';

export const FlightsModalRouter: FC = () => (
  <Routes>
    <Route path='create' element={<CreateFlight />} />
    <Route path=':id/update' element={<CreateFlight />} />
  </Routes>
);

export default FlightsModalRouter;
