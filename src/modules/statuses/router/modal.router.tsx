import { Route, Routes } from 'react-router-dom';
import { CreateStatus } from '../containers';

const StatusesModalRouter = () => (
    <Routes>
        <Route path='create' element={<CreateStatus />} />
        <Route path=':id/update' element={<CreateStatus />} />
    </Routes>
);

export default StatusesModalRouter;
