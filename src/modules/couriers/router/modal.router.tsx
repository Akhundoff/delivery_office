import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

const CreateCourierPage = React.lazy(() => import('../containers/create-courier').then((m) => ({ default: m.CreateCourier })));

const CouriersModalRouter: FC = () => (
  <Routes>
    <Route
      path='create'
      element={
        <React.Suspense fallback={null}>
          <CreateCourierPage />
        </React.Suspense>
      }
    />
  </Routes>
);

export default CouriersModalRouter;
