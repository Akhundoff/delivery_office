import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FlightsPage, FlightPaletsPage, FlightDetailsPage, FlightAirWaybillsPage, FlightPackagesPage, FlightPaletsByIdPage, FlightDeclarationsPage, BoxDeclarationsPage } from '../pages';

export const FlightsPageRouter: FC = () => (
  <Routes>
    <Route path="trendyol-cari" element={<FlightPaletsPage />} />
    <Route path=":id/declarations" element={<FlightDeclarationsPage />} />
    <Route path=":id/box/declarations" element={<BoxDeclarationsPage />} />
    <Route path=":id/air-waybills" element={<FlightAirWaybillsPage />} />
    <Route path=":id/packages" element={<FlightPackagesPage />} />
    <Route path=":id/palets" element={<FlightPaletsByIdPage />} />
    <Route path=":id" element={<FlightDetailsPage />} />
    <Route index element={<FlightsPage />} />
  </Routes>
);

export default FlightsPageRouter;
