import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UsersPage } from '../pages';
import { UserDetailsPage } from '../pages/user-details';
import { DiscountUsersPage } from '../pages/discount-users';
import { CreateDiscountPage } from '../pages/create-discount';

export const UsersRouter: FC = () => {
    return (
        <Routes>
            <Route index element={<UsersPage />} />
            <Route path='discounts' element={<DiscountUsersPage />} />
            <Route path=':id/discount' element={<CreateDiscountPage />} />
            <Route path=':id' element={<UserDetailsPage />} />
        </Routes>
    );
};

export default UsersRouter;
