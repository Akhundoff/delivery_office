import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateDeclaration } from '../containers/create-declaration';

const DeclarationsModalRouter = () => {
    return (
        <Routes>
            <Route path='create' element={<CreateDeclaration />} />
            <Route path=':id/update' element={<CreateDeclaration />} />
        </Routes>
    );
};

export default DeclarationsModalRouter;
