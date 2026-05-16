import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { TransportationConditionsPage } from "../pages";

export const TransportationConditionsRouter: FC = () => (
  <Routes>
    <Route index element={<TransportationConditionsPage />} />
  </Routes>
);

export default TransportationConditionsRouter;
