import { Route, Routes } from 'react-router-dom';
import { CreatePlan } from '../containers';
import { PlanCategoriesPage } from '../pages/plan-categories';

const PlansModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreatePlan />} />
    <Route path=":id/update" element={<CreatePlan />} />
    <Route path="categories" element={<PlanCategoriesPage />} />
  </Routes>
);

export default PlansModalRouter;
