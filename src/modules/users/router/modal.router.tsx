import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateUser } from '../containers/create-user';
import { UpdateUserPermissionsModal } from '../containers/update-user-permissions-modal';

const UsersModalRouter = () => {
    return (
        <Routes>
            <Route path='create' element={<CreateUser />} />
            <Route path=':id/update' element={<CreateUser />} />
            <Route path=':id/permissions' element={<UpdateUserPermissionsModal />} />
        </Routes>
    );
};

export default UsersModalRouter;
