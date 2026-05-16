import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { StatusesPage } from "../pages";

export const StatusesRouter: FC = () => (
  <Routes>
    <Route index element={<StatusesPage />} />
  </Routes>
);

export default StatusesRouter;
