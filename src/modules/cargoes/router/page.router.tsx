import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CargoesPage } from "../pages";

export const CargoesRouter: FC = () => (
  <Routes>
    <Route index element={<CargoesPage />} />
  </Routes>
);

export default CargoesRouter;
