import { Route, Routes } from "react-router-dom";
import { CreateBranch } from "../containers";

const BranchesModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateBranch />} />
    <Route path=":id/update" element={<CreateBranch />} />
  </Routes>
);

export default BranchesModalRouter;
