import { Route, Routes } from 'react-router-dom';
import { CreateRefund } from '../containers';

const RefundsModalRouter = () => (
    <Routes>
        <Route path='create' element={<CreateRefund />} />
        <Route path=':id/update' element={<CreateRefund />} />
    </Routes>
);

export default RefundsModalRouter;
