import { Route, Routes } from "react-router-dom";
import { CreateShopName } from "../containers";

const ShopNamesModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateShopName />} />
    <Route path=":id/update" element={<CreateShopName />} />
  </Routes>
);

export default ShopNamesModalRouter;
