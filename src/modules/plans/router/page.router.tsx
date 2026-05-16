import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { PlansPage } from "../pages";

export const PlansRouter: FC = () => (
  <Routes><Route index element={<PlansPage />} /></Routes>
);

export default PlansRouter;
