import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SendSortingModal } from '../containers';

const SortingModalRouter: FC = () => (
  <Routes>
    <Route path=":id/send" element={<SendSortingModal />} />
  </Routes>
);

export default SortingModalRouter;
