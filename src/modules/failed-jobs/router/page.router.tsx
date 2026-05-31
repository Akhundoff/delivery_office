import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { FailedJobsPage } from "../pages";

export const FailedJobsRouter: FC = () => (
  <Routes>
    <Route index element={<FailedJobsPage />} />
  </Routes>
);

export default FailedJobsRouter;
