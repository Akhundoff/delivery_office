import { Route, Routes } from 'react-router-dom';
import { CreateInspection, BranchInspectionDetails, BranchInspectionReport } from '../containers';

const BranchInspectionsModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateInspection />} />
    <Route path=":id/details" element={<BranchInspectionDetails />} />
    <Route path=":id/report" element={<BranchInspectionReport />} />
  </Routes>
);

export default BranchInspectionsModalRouter;
