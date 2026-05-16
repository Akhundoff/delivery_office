import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateShop } from "../containers";

export const ShopsModalRouter: FC = () => (
  <Routes>
    <Route path="create" element={<CreateShop />} />
    <Route path=":id/update" element={<CreateShop />} />
  </Routes>
);

export default ShopsModalRouter;
