import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DnsQueuesPage } from '../pages';

const CustomsDeclarationsPage = React.lazy(() => import('../pages/customs-declarations').then((m) => ({ default: m.CustomsDeclarationsPage })));
const CustomsPostsPage = React.lazy(() => import('../pages/customs-posts').then((m) => ({ default: m.CustomsPostsPage })));

export const CustomsRouter: FC = () => (
  <Routes>
    <Route path='dns-queues' element={<DnsQueuesPage />} />
    <Route
      path='declarations'
      element={
        <React.Suspense fallback={null}>
          <CustomsDeclarationsPage />
        </React.Suspense>
      }
    />
    <Route
      path='posts'
      element={
        <React.Suspense fallback={null}>
          <CustomsPostsPage />
        </React.Suspense>
      }
    />
  </Routes>
);

export default CustomsRouter;
