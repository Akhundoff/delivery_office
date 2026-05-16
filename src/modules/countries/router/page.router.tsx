import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CountriesPage } from "../pages";

export const CountriesRouter: FC = () => (
  <Routes>
    <Route index element={<CountriesPage />} />
  </Routes>
);

export default CountriesRouter;
