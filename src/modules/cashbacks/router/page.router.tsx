import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CashbacksPage } from "../pages";

export const CashbacksRouter: FC = () => (
  <Routes>
    <Route index element={<CashbacksPage />} />
  </Routes>
);

export default CashbacksRouter;
