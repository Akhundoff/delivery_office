import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BoxTransfersPage } from '../pages';

const BoxTransfersPageRouter: FC = () => (
    <Routes>
        <Route index element={<BoxTransfersPage />} />
        <Route path=':id/:type' element={<BoxTransfersPage />} />
    </Routes>
);

export default BoxTransfersPageRouter;
