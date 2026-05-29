import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateTransaction } from '../containers';

const TransactionsModalRouter: FC = () => (
  <Routes>
    <Route path='create' element={<CreateTransaction />} />
  </Routes>
);

export default TransactionsModalRouter;
