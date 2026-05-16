import { Route, Routes } from "react-router-dom";
import { CreateReturnType } from "../containers";

const ReturnTypesModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateReturnType />} />
    <Route path=":id/update" element={<CreateReturnType />} />
  </Routes>
);

export default ReturnTypesModalRouter;
