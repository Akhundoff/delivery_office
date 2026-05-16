import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { ShopsPage } from "../pages";

export const ShopsRouter: FC = () => (
  <Routes>
    <Route index element={<ShopsPage />} />
  </Routes>
);

export default ShopsRouter;
