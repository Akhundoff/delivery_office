import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { PopupsPage } from "../pages";

export const PopupsRouter: FC = () => (
  <Routes>
    <Route index element={<PopupsPage />} />
  </Routes>
);

export default PopupsRouter;
