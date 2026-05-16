import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { ShopNamesPage } from "../pages";

export const ShopNamesRouter: FC = () => (
  <Routes><Route index element={<ShopNamesPage />} /></Routes>
);

export default ShopNamesRouter;
