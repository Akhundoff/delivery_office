import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FailedJobsPreview } from '../containers/failed-jobs-preview';

export const FailedJobsModalRouter: FC = () => (
  <Routes>
    <Route path='preview' element={<FailedJobsPreview />} />
  </Routes>
);

export default FailedJobsModalRouter;
