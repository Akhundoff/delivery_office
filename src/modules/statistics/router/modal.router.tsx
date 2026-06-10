import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { OrdersByAdminDetailsModal, OrdersByStatusDetailsModal } from '../containers/orders-details-modal';
import { CouriersCountDetailsModal, CouriersByRegionsDetailsModal } from '../containers/couriers-details-modal';
import { TransactionsByPaymentTypeDetailsModal, TransactionsByUserDetailsModal } from '../containers/transactions-details-modal';
import { DeclarationsByStatusDetailsModal, PaymentTypesByDeclarationsDetailsModal } from '../containers/declarations-details-modal';
import { UsersCountDetailsModal } from '../containers/users-details-modal';
import { CashFlowDetailsModal } from '../containers/cashflow-details-modal';
import {
    CouriersByRegionsOverviewModal,
    DeclarationCountsByStatusModal,
    OrderCountsByStatusModal,
    UsersGeneralModal,
    TransactionBalancesModal,
} from '../containers/aggregated-modals';

const StatisticsModalRouter: FC = () => (
    <Routes>
        <Route path='orders/by-admin/details' element={<OrdersByAdminDetailsModal />} />
        <Route path='orders/by-status/details' element={<OrdersByStatusDetailsModal />} />
        <Route path='declarations/by-status/details' element={<DeclarationsByStatusDetailsModal />} />
        <Route path='users/counts/details' element={<UsersCountDetailsModal />} />
        <Route path='users/general' element={<UsersGeneralModal />} />
        <Route path='couriers/counts/details' element={<CouriersCountDetailsModal />} />
        <Route path='couriers/counts/by-regions/details' element={<CouriersByRegionsDetailsModal />} />
        <Route path='couriers/counts/by-regions/overview' element={<CouriersByRegionsOverviewModal />} />
        <Route path='transactions/by-user/details' element={<TransactionsByUserDetailsModal />} />
        <Route path='transactions/payment-counts/by-payment-types/details' element={<TransactionsByPaymentTypeDetailsModal />} />
        <Route path='transactions/payment-types/by-declarations/details' element={<PaymentTypesByDeclarationsDetailsModal />} />
        <Route path='transactions/balances' element={<TransactionBalancesModal />} />
        <Route path='cashflow-transactions/details' element={<CashFlowDetailsModal />} />
        <Route path='status/declaration-counts' element={<DeclarationCountsByStatusModal />} />
        <Route path='status/order-counts' element={<OrderCountsByStatusModal />} />
    </Routes>
);

export default StatisticsModalRouter;
