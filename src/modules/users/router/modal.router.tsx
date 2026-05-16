import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateUser } from '../containers/create-user';

const UsersModalRouter = () => {
    return (
        <Routes>
            <Route path='create' element={<CreateUser />} />
            <Route path=':id/update' element={<CreateUser />} />
        </Routes>
    );
};

export default UsersModalRouter;
