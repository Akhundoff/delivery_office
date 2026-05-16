import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { RefundsPage } from "../pages";

export const RefundsRouter: FC = () => (
  <Routes>
    <Route index element={<RefundsPage />} />
  </Routes>
);

export default RefundsRouter;
