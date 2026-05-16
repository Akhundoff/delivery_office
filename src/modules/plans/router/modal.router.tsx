import { Route, Routes } from "react-router-dom";
import { CreatePlan } from "../containers";

const PlansModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreatePlan />} />
    <Route path=":id/update" element={<CreatePlan />} />
  </Routes>
);

export default PlansModalRouter;
