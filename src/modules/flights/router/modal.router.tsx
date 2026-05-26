import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateFlight, UpdateAirWaybillModal, UpdateCurrentMonthModal, UploadManifestModal, CloseFlightModal } from '../containers';

export const FlightsModalRouter: FC = () => (
  <Routes>
    <Route path='create' element={<CreateFlight />} />
    <Route path=':id/update' element={<CreateFlight />} />
    <Route path=':id/air-waybills/update' element={<UpdateAirWaybillModal />} />
    <Route path=':id/current-month/update' element={<UpdateCurrentMonthModal />} />
    <Route path=':id/manifest/upload' element={<UploadManifestModal />} />
    <Route path=':id/close/:type' element={<CloseFlightModal />} />
  </Routes>
);

export default FlightsModalRouter;
