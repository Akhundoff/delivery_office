import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DeclarationsPage } from '../pages';
import { DeclarationDetailPage } from '../pages/detail';

const DeletedDeclarationsPage = React.lazy(() => import('../pages/deleted-declarations').then((m) => ({ default: m.DeletedDeclarationsPage })));
const PostDeclarationsPage = React.lazy(() => import('../pages/post-declarations').then((m) => ({ default: m.PostDeclarationsPage })));
const UnknownDeclarationsPage = React.lazy(() => import('../pages/unknown-declarations').then((m) => ({ default: m.UnknownDeclarationsPage })));
const PartnerDeclarationsPage = React.lazy(() => import('../pages/partner-declarations').then((m) => ({ default: m.PartnerDeclarationsPage })));

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
            <Route
                path='unknowns'
                element={
                    <React.Suspense fallback={null}>
                        <UnknownDeclarationsPage />
                    </React.Suspense>
                }
            />
            <Route
                path='partners'
                element={
                    <React.Suspense fallback={null}>
                        <PartnerDeclarationsPage />
                    </React.Suspense>
                }
            />
        </Routes>
    );
};

export default DeclarationsPageRouter;