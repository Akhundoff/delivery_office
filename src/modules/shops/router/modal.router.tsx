import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateShop } from "../containers";
import { ShopDetails } from "../pages/shop-details";

export const ShopsModalRouter: FC = () => (
  <Routes>
    <Route path="create" element={<CreateShop />} />
    <Route path=":id/update" element={<CreateShop />} />
    <Route path=":id/details" element={<ShopDetails />} />
  </Routes>
);

export default ShopsModalRouter;
