import { FC, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const CreateCashRegister = lazy(() => import('../containers/create-cash-register').then((m) => ({ default: m.CreateCashRegister })));
const CreateCashRegisterOperation = lazy(() => import('../containers/create-cash-register-operation').then((m) => ({ default: m.CreateCashRegisterOperation })));
const CreateCashFlowTransaction = lazy(() => import('../containers/create-cash-flow-transaction').then((m) => ({ default: m.CreateCashFlowTransaction })));

const CashFlowModalRouter: FC = () => (
    <Suspense fallback={null}>
        <Routes>
            <Route path='cash-registers/create' element={<CreateCashRegister />} />
            <Route path='cash-registers/:id/update' element={<CreateCashRegister />} />
            <Route path='operations/create' element={<CreateCashRegisterOperation />} />
            <Route path='operations/:id/update' element={<CreateCashRegisterOperation />} />
            <Route path='transactions/create' element={<CreateCashFlowTransaction />} />
            <Route path='transactions/:id/update' element={<CreateCashFlowTransaction />} />
        </Routes>
    </Suspense>
);

export default CashFlowModalRouter;
