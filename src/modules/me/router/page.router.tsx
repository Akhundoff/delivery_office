import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/login';

const MeRouter: FC = () => {
    return (
        <Routes>
            <Route path='/' element={<LoginPage />} />
        </Routes>
    );
};

export default MeRouter;
