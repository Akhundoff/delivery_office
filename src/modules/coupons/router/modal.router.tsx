import { Route, Routes } from 'react-router-dom';
import { CreateCoupon } from '../containers';

const CouponsModalRouter = () => (
    <Routes>
        <Route path='create' element={<CreateCoupon />} />
        <Route path=':id/update' element={<CreateCoupon />} />
    </Routes>
);

export default CouponsModalRouter;
