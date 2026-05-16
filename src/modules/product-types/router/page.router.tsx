import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { ProductTypesPage } from "../pages";

export const ProductTypesRouter: FC = () => (
  <Routes>
    <Route index element={<ProductTypesPage />} />
  </Routes>
);

export default ProductTypesRouter;
