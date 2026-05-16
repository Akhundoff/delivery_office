import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { AzerpostQueuesPage } from "../pages";

export const AzerpostQueuesRouter: FC = () => (
  <Routes>
    <Route index element={<AzerpostQueuesPage />} />
  </Routes>
);

export default AzerpostQueuesRouter;
