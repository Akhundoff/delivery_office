import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { SystemSettingsPage } from "../pages";

export const SystemSettingsRouter: FC = () => (
  <Routes>
    <Route index element={<SystemSettingsPage />} />
  </Routes>
);

export default SystemSettingsRouter;
