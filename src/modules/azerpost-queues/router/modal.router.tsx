import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AzerpostQueueRequestBodyPreview } from '../containers/azerpost-queue-request-body-preview';
import { AzerpostQueueResponseBodyPreview } from '../containers/azerpost-queue-response-body-preview';

export const AzerpostQueuesModalRouter: FC = () => (
  <Routes>
    <Route path='request-body' element={<AzerpostQueueRequestBodyPreview />} />
    <Route path='response-body' element={<AzerpostQueueResponseBodyPreview />} />
  </Routes>
);

export default AzerpostQueuesModalRouter;
