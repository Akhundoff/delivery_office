import { Route, Routes } from "react-router-dom";
import { CreateBox } from "../containers";

const BoxesModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateBox />} />
    <Route path=":id/update" element={<CreateBox />} />
  </Routes>
);

export default BoxesModalRouter;
