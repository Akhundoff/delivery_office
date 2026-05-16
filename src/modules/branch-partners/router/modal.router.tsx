import { Route, Routes } from "react-router-dom";
import { CreateBranchPartner } from "../containers";

const BranchPartnersModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateBranchPartner />} />
    <Route path=":id/update" element={<CreateBranchPartner />} />
  </Routes>
);

export default BranchPartnersModalRouter;
