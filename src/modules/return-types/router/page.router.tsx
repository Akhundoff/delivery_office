import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { ReturnTypesPage } from "../pages";

export const ReturnTypesRouter: FC = () => (
  <Routes>
    <Route index element={<ReturnTypesPage />} />
  </Routes>
);

export default ReturnTypesRouter;
