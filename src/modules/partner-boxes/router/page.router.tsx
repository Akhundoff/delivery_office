import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PartnerBoxesPage } from '../pages';

export const PartnerBoxesRouter: FC = () => (
  <Routes><Route index element={<PartnerBoxesPage />} /></Routes>
);

export default PartnerBoxesRouter;
