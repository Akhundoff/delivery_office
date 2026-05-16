import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { UnitedQueuesPage } from "../pages";

export const UnitedQueuesRouter: FC = () => (
  <Routes>
    <Route index element={<UnitedQueuesPage />} />
  </Routes>
);

export default UnitedQueuesRouter;
