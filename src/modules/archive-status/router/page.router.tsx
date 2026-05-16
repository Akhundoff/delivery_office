import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { ArchiveStatusPage } from "../pages";

export const ArchiveStatusRouter: FC = () => (
  <Routes>
    <Route index element={<ArchiveStatusPage />} />
  </Routes>
);

export default ArchiveStatusRouter;
