import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BranchInspectionsPage, BranchInspectionScanPage } from '../pages';

const BranchInspectionsPageRouter: FC = () => (
  <Routes>
    <Route index element={<BranchInspectionsPage />} />
    <Route path=":id/scan" element={<BranchInspectionScanPage />} />
  </Routes>
);

export default BranchInspectionsPageRouter;
