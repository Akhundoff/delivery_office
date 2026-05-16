import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { RegionsPage } from "../pages";

export const RegionsRouter: FC = () => (
  <Routes>
    <Route index element={<RegionsPage />} />
  </Routes>
);

export default RegionsRouter;
