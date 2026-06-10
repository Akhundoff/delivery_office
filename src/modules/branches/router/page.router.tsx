import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { BranchesPage, FlyexLocationsPage } from "../pages";

export const BranchesRouter: FC = () => (
  <Routes>
    <Route index element={<BranchesPage />} />
    <Route path="flyex-locations" element={<FlyexLocationsPage />} />
  </Routes>
);

export default BranchesRouter;
