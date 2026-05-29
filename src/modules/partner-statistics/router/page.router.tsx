import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PartnerStatisticsPage } from '../pages';

export const PartnerStatisticsRouter: FC = () => (
  <Routes><Route index element={<PartnerStatisticsPage />} /></Routes>
);

export default PartnerStatisticsRouter;
