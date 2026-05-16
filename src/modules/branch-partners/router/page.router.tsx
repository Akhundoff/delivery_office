import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { BranchPartnersPage } from "../pages";

export const BranchPartnersRouter: FC = () => (
  <Routes>
    <Route index element={<BranchPartnersPage />} />
  </Routes>
);

export default BranchPartnersRouter;
