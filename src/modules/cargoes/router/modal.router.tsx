import { Route, Routes } from "react-router-dom";
import { CreateCargo } from "../containers";

const CargoesModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateCargo />} />
    <Route path=":id/update" element={<CreateCargo />} />
  </Routes>
);

export default CargoesModalRouter;
