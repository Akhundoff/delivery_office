import { Route, Routes } from "react-router-dom";
import { CreateProductType } from "../containers";

const ProductTypesModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateProductType />} />
    <Route path=":id/update" element={<CreateProductType />} />
  </Routes>
);

export default ProductTypesModalRouter;
