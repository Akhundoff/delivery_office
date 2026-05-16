import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DnsQueuesQueryPreview } from '../containers/dns-queues-query-preview';
import { DnsQueuesResponsePreview } from '../containers/dns-queues-response-preview';

export const CustomsModalRouter: FC = () => (
  <Routes>
    <Route path='dns-queues/preview/query' element={<DnsQueuesQueryPreview />} />
    <Route path='dns-queues/preview/response' element={<DnsQueuesResponsePreview />} />
  </Routes>
);

export default CustomsModalRouter;
