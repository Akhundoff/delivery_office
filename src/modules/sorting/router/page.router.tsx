import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SortingsPage, SortingDetailsPage, NonSortedDeclarationsPage, NewBranchTransferPage } from '../pages';

const SortingPageRouter: FC = () => (
  <Routes>
    <Route index element={<SortingsPage />} />
    <Route path="acceptance" element={<NewBranchTransferPage />} />
    <Route path=":flightId/non-sorted-declarations" element={<NonSortedDeclarationsPage />} />
    <Route path=":id" element={<SortingDetailsPage />} />
  </Routes>
);

export default SortingPageRouter;
