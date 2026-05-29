import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PartnerBoxAcceptancePage } from '../pages';

export const PartnerBoxAcceptanceRouter: FC = () => (
  <Routes>
    <Route index element={<PartnerBoxAcceptancePage />} />
  </Routes>
);

export default PartnerBoxAcceptanceRouter;
