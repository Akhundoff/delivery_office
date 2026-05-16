import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { ModelsPage } from "../pages";

export const ModelsRouter: FC = () => (
  <Routes><Route index element={<ModelsPage />} /></Routes>
);

export default ModelsRouter;
