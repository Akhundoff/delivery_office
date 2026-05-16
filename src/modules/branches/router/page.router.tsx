import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { BranchesPage } from "../pages";

export const BranchesRouter: FC = () => (
  <Routes>
    <Route index element={<BranchesPage />} />
  </Routes>
);

export default BranchesRouter;
