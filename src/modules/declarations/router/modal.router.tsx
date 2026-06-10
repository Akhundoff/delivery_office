import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateDeclaration } from '../containers/create-declaration';
import { UnknownDeclarationDetail } from '../containers/unknown-declaration-detail';
import { PayDeclarationModal } from '../containers/pay-declaration-modal';
import { BulkHandoverModal } from '../containers/bulk-handover-modal';
import { HandoverDeclarationModal } from '../containers/handover-declaration-modal';
import { ReturnDeclarationModal } from '../containers/return-declaration-modal';
import { DeclarationTimeline } from '../containers/declaration-timeline';

const DeclarationsModalRouter = () => {
    return (
        <Routes>
            <Route path='create' element={<CreateDeclaration />} />
            <Route path=':id/update' element={<CreateDeclaration />} />
            <Route path='unknowns/:id' element={<UnknownDeclarationDetail />} />
            <Route path=':id/timeline' element={<DeclarationTimeline />} />
            <Route path=':id/pay' element={<PayDeclarationModal />} />
            <Route path=':id/handover' element={<HandoverDeclarationModal />} />
            <Route path=':id/return' element={<ReturnDeclarationModal />} />
            <Route path='handover' element={<BulkHandoverModal />} />
        </Routes>
    );
};

export default DeclarationsModalRouter;
