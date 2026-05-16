import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { BoxesPage } from "../pages";

export const BoxesRouter: FC = () => (
  <Routes><Route index element={<BoxesPage />} /></Routes>
);

export default BoxesRouter;
