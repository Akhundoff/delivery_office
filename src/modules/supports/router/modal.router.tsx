import { Route, Routes } from 'react-router-dom';
import { CreateSupport, SupportCategories } from '../containers';

const SupportsModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateSupport />} />
    <Route path="categories" element={<SupportCategories />} />
  </Routes>
);

export default SupportsModalRouter;
