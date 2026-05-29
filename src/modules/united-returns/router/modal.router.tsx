import { Route, Routes } from 'react-router-dom';
import { CreateUnitedReturn } from '../containers';

const UnitedReturnsModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateUnitedReturn />} />
    <Route path=":id/update" element={<CreateUnitedReturn />} />
  </Routes>
);

export default UnitedReturnsModalRouter;
