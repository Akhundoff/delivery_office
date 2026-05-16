import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CouponsPage } from "../pages";

export const CouponsRouter: FC = () => (
  <Routes>
    <Route index element={<CouponsPage />} />
  </Routes>
);

export default CouponsRouter;
