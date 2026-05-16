import { Route, Routes } from "react-router-dom";
import { CreateRegion } from "../containers";

const RegionsModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateRegion />} />
    <Route path=":id/update" element={<CreateRegion />} />
  </Routes>
);

export default RegionsModalRouter;
