import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MeContext } from '@modules/me';
import { CreateDeclaration } from '../containers/create-declaration';
import { UnknownDeclarationDetail } from '../containers/unknown-declaration-detail';
import { PayDeclarationModal } from '../containers/pay-declaration-modal';
import { BulkHandoverModal } from '../containers/bulk-handover-modal';
import { HandoverDeclarationModal } from '../containers/handover-declaration-modal';
import { ReturnDeclarationModal } from '../containers/return-declaration-modal';
import { DeclarationTimeline } from '../containers/declaration-timeline';
import { StuckAtCustomsModal } from '../containers/stuck-at-customs-modal';

const ImportDeclarationModal = React.lazy(() => import('../containers/import-declaration-modal').then((m) => ({ default: m.ImportDeclarationModal })));
const HandoverExportModal = React.lazy(() => import('../containers/handover-export-modal').then((m) => ({ default: m.HandoverExportModal })));
const CreateUnknownDeclaration = React.lazy(() => import('../containers/create-unknown-declaration').then((m) => ({ default: m.CreateUnknownDeclaration })));

const DeclarationsModalRouter = () => {
  const { can } = useContext(MeContext);
  return (
    <Routes>
      <Route path="create" element={<CreateDeclaration />} />
      <Route path=":id/update" element={<CreateDeclaration />} />
      <Route
        path="unknowns/create"
        element={
          <React.Suspense fallback={null}>
            <CreateUnknownDeclaration />
          </React.Suspense>
        }
      />
      <Route
        path="unknowns/:id/update"
        element={
          <React.Suspense fallback={null}>
            <CreateUnknownDeclaration />
          </React.Suspense>
        }
      />
      <Route path="unknowns/:id" element={<UnknownDeclarationDetail />} />
      <Route path=":id/timeline" element={<DeclarationTimeline />} />
      <Route path=":id/pay" element={<PayDeclarationModal />} />
      {can('declarations_handover') && <Route path=":id/handover" element={<HandoverDeclarationModal />} />}
      <Route path=":id/return" element={<ReturnDeclarationModal />} />
      <Route path=":id/stuck-at-customs" element={<StuckAtCustomsModal />} />
      <Route path="stuck-at-customs" element={<StuckAtCustomsModal />} />
      {can('declarations_handover') && <Route path="handover" element={<BulkHandoverModal />} />}
      {can('declarations_handover') && (
        <Route
          path="handover-export"
          element={
            <React.Suspense fallback={null}>
              <HandoverExportModal />
            </React.Suspense>
          }
        />
      )}
      <Route
        path="import"
        element={
          <React.Suspense fallback={null}>
            <ImportDeclarationModal />
          </React.Suspense>
        }
      />
    </Routes>
  );
};

export default DeclarationsModalRouter;
