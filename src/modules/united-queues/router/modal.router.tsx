import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UnitedQueuesPayloadPreview } from '../containers/united-queues-payload-preview';
import { UnitedQueuesResponsePreview } from '../containers/united-queues-response-preview';

export const UnitedQueuesModalRouter: FC = () => (
  <Routes>
    <Route path='preview/payload' element={<UnitedQueuesPayloadPreview />} />
    <Route path='preview/response' element={<UnitedQueuesResponsePreview />} />
  </Routes>
);

export default UnitedQueuesModalRouter;
