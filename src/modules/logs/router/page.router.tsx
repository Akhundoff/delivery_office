import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { LogsPage } from "../pages";

export const LogsRouter: FC = () => (
  <Routes>
    <Route index element={<LogsPage />} />
  </Routes>
);

export default LogsRouter;
