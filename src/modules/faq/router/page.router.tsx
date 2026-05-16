import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { FaqPage } from "../pages";

export const FaqRouter: FC = () => (
  <Routes>
    <Route index element={<FaqPage />} />
  </Routes>
);

export default FaqRouter;
