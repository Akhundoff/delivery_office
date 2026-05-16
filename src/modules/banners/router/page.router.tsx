import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { BannersPage } from "../pages";

export const BannersRouter: FC = () => (
  <Routes>
    <Route index element={<BannersPage />} />
  </Routes>
);

export default BannersRouter;
