import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DeclarationsPage } from '../pages';
import { DeclarationDetailPage } from '../pages/detail';

const DeletedDeclarationsPage = React.lazy(() => import('../pages/deleted-declarations').then((m) => ({ default: m.DeletedDeclarationsPage })));
const PostDeclarationsPage = React.lazy(() => import('../pages/post-declarations').then((m) => ({ default: m.PostDeclarationsPage })));

const DeclarationsPageRouter: FC = () => {
    return (
        <Routes>
            <Route index element={<DeclarationsPage />} />
            <Route path=':id' element={<DeclarationDetailPage />} />
            <Route
                path='deleted'
                element={
                    <React.Suspense fallback={null}>
                        <DeletedDeclarationsPage />
                    </React.Suspense>
                }
            />
            <Route
                path='post'
                element={
                    <React.Suspense fallback={null}>
                        <PostDeclarationsPage />
                    </React.Suspense>
                }
            />
        </Routes>
    );
};

export default DeclarationsPageRouter;