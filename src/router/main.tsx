import { FC, lazy, Suspense, useContext } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MeContext } from '../modules/me/context/context';
import { AppLayout } from '../modules/layout';
import { SuspenseSpin } from '../shared/styled/spin';

const MeRouter = lazy(() => import('../modules/me/router/page.router'));

// Page Routers
const UsersRouter = lazy(() => import('../modules/users/router/page.router'));
const DeclarationsRouter = lazy(() => import('../modules/declarations/router/page.router'));
const FlightsRouter = lazy(() => import('../modules/flights/router/page.router'));
const SystemSettingsRouter = lazy(() => import('../modules/system-settings/router/page.router'));
const CouponsRouter = lazy(() => import('../modules/coupons/router/page.router'));
const RefundsRouter = lazy(() => import('../modules/refunds/router/page.router'));
const CashbacksRouter = lazy(() => import('../modules/cashbacks/router/page.router'));
const CargoesRouter = lazy(() => import('../modules/cargoes/router/page.router'));
const BoxesRouter = lazy(() => import('../modules/boxes/router/page.router'));
const ShopNamesRouter = lazy(() => import('../modules/shop-names/router/page.router'));
const ReturnTypesRouter = lazy(() => import('../modules/return-types/router/page.router'));
const CountriesRouter = lazy(() => import('../modules/countries/router/page.router'));
const BranchesRouter = lazy(() => import('../modules/branches/router/page.router'));
const BranchPartnersRouter = lazy(() => import('../modules/branch-partners/router/page.router'));
const PlansRouter = lazy(() => import('../modules/plans/router/page.router'));
const ProductTypesRouter = lazy(() => import('../modules/product-types/router/page.router'));
const RegionsRouter = lazy(() => import('../modules/regions/router/page.router'));
const ModelsRouter = lazy(() => import('../modules/models/router/page.router'));
const StatusesRouter = lazy(() => import('../modules/statuses/router/page.router'));
const ArchiveStatusRouter = lazy(() => import('../modules/archive-status/router/page.router'));
const LogsRouter = lazy(() => import('../modules/logs/router/page.router'));
const NewsRouter = lazy(() => import('../modules/news/router/page.router'));
const FaqRouter = lazy(() => import('../modules/faq/router/page.router'));
const ShopsRouter = lazy(() => import('../modules/shops/router/page.router'));
const AboutRouter = lazy(() => import('../modules/about/router/page.router'));
const TransportationConditionsRouter = lazy(() => import('../modules/transportation-conditions/router/page.router'));
const BannersRouter = lazy(() => import('../modules/banners/router/page.router'));
const PopupsRouter = lazy(() => import('../modules/popups/router/page.router'));
const DeliveryProofsRouter = lazy(() => import('../modules/delivery-proofs/router/page.router'));
const CustomsRouter = lazy(() => import('../modules/customs/router/page.router'));
const UnitedQueuesRouter = lazy(() => import('../modules/united-queues/router/page.router'));
const AzerpostQueuesRouter = lazy(() => import('../modules/azerpost-queues/router/page.router'));
const FailedJobsRouter = lazy(() => import('../modules/failed-jobs/router/page.router'));
const NotifierRouter = lazy(() => import('../modules/notifier/router/page.router'));
const TicketTemplatesRouter = lazy(() => import('../modules/ticket-templates/router/page.router'));
const PartnerBoxesRouter = lazy(() => import('../modules/partner-boxes/router/page.router'));
const PartnerBoxAcceptanceRouter = lazy(() => import('../modules/partner-box-acceptance/router/page.router'));
const PartnerStatisticsRouter = lazy(() => import('../modules/partner-statistics/router/page.router'));
const TelegramBotUsersRouter = lazy(() => import('../modules/telegram-bot-users/router/page.router'));
const TransactionsRouter = lazy(() => import('../modules/transactions/router/page.router'));
const CouriersRouter = lazy(() => import('../modules/couriers/router/page.router'));
const SupportsRouter = lazy(() => import('../modules/supports/router/page.router'));
const UnitedDeclarationsRouter = lazy(() => import('../modules/united-declarations/router/page.router'));
const UnitedReturnsRouter = lazy(() => import('../modules/united-returns/router/page.router'));
const BranchInspectionsRouter = lazy(() => import('../modules/branch-inspections/router/page.router'));
const OrdersRouter = lazy(() => import('../modules/orders/router/page.router'));
const CashFlowRouter = lazy(() => import('../modules/cash-flow/router/page.router'));
const StatisticsRouter = lazy(() => import('../modules/statistics/router/page.router'));
const WarehouseRouter = lazy(() => import('../modules/warehouse/router/page.router'));
const BoxTransfersRouter = lazy(() => import('../modules/box-transfers/router/page.router'));
const AppointmentRouter = lazy(() => import('../modules/appointment/router/page.router'));
const SortingRouter = lazy(() => import('../modules/sorting/router/page.router'));
const SortingModalRouter = lazy(() => import('../modules/sorting/router/modal.router'));

// Modal Routers
const UsersModalRouter = lazy(() => import('../modules/users/router/modal.router'));
const DeclarationsModalRouter = lazy(() => import('../modules/declarations/router/modal.router'));
const FlightsModalRouter = lazy(() => import('../modules/flights/router/modal.router'));
const CargoesModalRouter = lazy(() => import('../modules/cargoes/router/modal.router'));
const BoxesModalRouter = lazy(() => import('../modules/boxes/router/modal.router'));
const ShopNamesModalRouter = lazy(() => import('../modules/shop-names/router/modal.router'));
const ReturnTypesModalRouter = lazy(() => import('../modules/return-types/router/modal.router'));
const PlansModalRouter = lazy(() => import('../modules/plans/router/modal.router'));
const ProductTypesModalRouter = lazy(() => import('../modules/product-types/router/modal.router'));
const RegionsModalRouter = lazy(() => import('../modules/regions/router/modal.router'));
const BranchPartnersModalRouter = lazy(() => import('../modules/branch-partners/router/modal.router'));
const BranchesModalRouter = lazy(() => import('../modules/branches/router/modal.router'));
const CountriesModalRouter = lazy(() => import('../modules/countries/router/modal.router'));
const FaqModalRouter = lazy(() => import('../modules/faq/router/modal.router'));
const NewsModalRouter = lazy(() => import('../modules/news/router/modal.router'));
const ShopsModalRouter = lazy(() => import('../modules/shops/router/modal.router'));
const BannersModalRouter = lazy(() => import('../modules/banners/router/modal.router'));
const PopupsModalRouter = lazy(() => import('../modules/popups/router/modal.router'));
const LogsModalRouter = lazy(() => import('../modules/logs/router/modal.router'));
const CustomsModalRouter = lazy(() => import('../modules/customs/router/modal.router'));
const UnitedQueuesModalRouter = lazy(() => import('../modules/united-queues/router/modal.router'));
const AzerpostQueuesModalRouter = lazy(() => import('../modules/azerpost-queues/router/modal.router'));
const FailedJobsModalRouter = lazy(() => import('../modules/failed-jobs/router/modal.router'));
const PartnerBoxesModalRouter = lazy(() => import('../modules/partner-boxes/router/modal.router'));
const CouponsModalRouter = lazy(() => import('../modules/coupons/router/modal.router'));
const RefundsModalRouter = lazy(() => import('../modules/refunds/router/modal.router'));
const StatusesModalRouter = lazy(() => import('../modules/statuses/router/modal.router'));
const TransactionsModalRouter = lazy(() => import('../modules/transactions/router/modal.router'));
const CouriersModalRouter = lazy(() => import('../modules/couriers/router/modal.router'));
const CashFlowModalRouter = lazy(() => import('../modules/cash-flow/router/modal.router'));
const UnitedReturnsModalRouter = lazy(() => import('../modules/united-returns/router/modal.router'));
const BranchInspectionsModalRouter = lazy(() => import('../modules/branch-inspections/router/modal.router'));
const SupportsModalRouter = lazy(() => import('../modules/supports/router/modal.router'));
const OrdersModalRouter = lazy(() => import('../modules/orders/router/modal.router'));
const StatisticsModalRouter = lazy(() => import('../modules/statistics/router/modal.router'));

export const MainRouter: FC = () => {
  const location = useLocation();
  const { state } = location;
  const me = useContext(MeContext);

  if (me.state.user.loading) {
    return <SuspenseSpin />;
  }

  if (!me.state.user.data) {
    return (
      <Suspense fallback={<SuspenseSpin />}>
        <Routes>
          <Route path="/*" element={<MeRouter />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <AppLayout>
      <Suspense fallback={<SuspenseSpin />}>
        <Routes location={state?.background || location}>
          <Route path="/users/*" element={<UsersRouter />} />
          <Route path="/declarations/*" element={<DeclarationsRouter />} />
          <Route path="/flights/*" element={<FlightsRouter />} />
          <Route path="/settings/*" element={<SystemSettingsRouter />} />
          <Route path="/coupons/*" element={<CouponsRouter />} />
          <Route path="/refunds/*" element={<RefundsRouter />} />
          <Route path="/cashback/*" element={<CashbacksRouter />} />
          <Route path="/cargoes/*" element={<CargoesRouter />} />
          <Route path="/boxes/*" element={<BoxesRouter />} />
          <Route path="/shop-names/*" element={<ShopNamesRouter />} />
          <Route path="/return-types/*" element={<ReturnTypesRouter />} />
          <Route path="/countries/*" element={<CountriesRouter />} />
          <Route path="/branches/*" element={<BranchesRouter />} />
          <Route path="/branch-partners/*" element={<BranchPartnersRouter />} />
          <Route path="/plans/*" element={<PlansRouter />} />
          <Route path="/product-types/*" element={<ProductTypesRouter />} />
          <Route path="/regions/*" element={<RegionsRouter />} />
          <Route path="/models/*" element={<ModelsRouter />} />
          <Route path="/status/*" element={<StatusesRouter />} />
          <Route path="/archive/state/*" element={<ArchiveStatusRouter />} />
          <Route path="/logs/*" element={<LogsRouter />} />
          <Route path="/news/*" element={<NewsRouter />} />
          <Route path="/faq/*" element={<FaqRouter />} />
          <Route path="/shops/*" element={<ShopsRouter />} />
          <Route path="/about/*" element={<AboutRouter />} />
          <Route path="/transportation_conditions/*" element={<TransportationConditionsRouter />} />
          <Route path="/banners/*" element={<BannersRouter />} />
          <Route path="/popups/*" element={<PopupsRouter />} />
          <Route path="/delivery-proofs/*" element={<DeliveryProofsRouter />} />
          <Route path="/customs/*" element={<CustomsRouter />} />
          <Route path="/united-queues/*" element={<UnitedQueuesRouter />} />
          <Route path="/azerpost-queues/*" element={<AzerpostQueuesRouter />} />
          <Route path="/failed-jobs/*" element={<FailedJobsRouter />} />
          <Route path="/notifier/*" element={<NotifierRouter />} />
          <Route path="/ticket-templates/*" element={<TicketTemplatesRouter />} />
          <Route path="/partner-boxes/*" element={<PartnerBoxesRouter />} />
          <Route path="/partner/acceptance/box/*" element={<PartnerBoxAcceptanceRouter />} />
          <Route path="/statistics/branches-partner/*" element={<PartnerStatisticsRouter />} />
          <Route path="/telegram-bot-users/*" element={<TelegramBotUsersRouter />} />
          <Route path="/transactions/*" element={<TransactionsRouter />} />
          <Route path="/couriers/*" element={<CouriersRouter />} />
          <Route path="/supports/*" element={<SupportsRouter />} />
          <Route path="/united-declarations/*" element={<UnitedDeclarationsRouter />} />
          <Route path="/united-returns/*" element={<UnitedReturnsRouter />} />
          <Route path="/branch-inspections/*" element={<BranchInspectionsRouter />} />
          <Route path="/orders/*" element={<OrdersRouter />} />
          <Route path="/cash-flow/*" element={<CashFlowRouter />} />
          <Route path="/statistics/*" element={<StatisticsRouter />} />
          <Route path="/warehouse/*" element={<WarehouseRouter />} />
          <Route path="/box-transfers/*" element={<BoxTransfersRouter />} />
          <Route path="/appointment/*" element={<AppointmentRouter />} />
          <Route path="/sorting/*" element={<SortingRouter />} />
          <Route path="*" element={<Navigate to="/statistics" replace />} />
        </Routes>
        <Routes>
          <Route path="/users/*" element={<UsersModalRouter />} />
          <Route path="/declarations/*" element={<DeclarationsModalRouter />} />
          <Route path="/flights/*" element={<FlightsModalRouter />} />
          <Route path="/cargoes/*" element={<CargoesModalRouter />} />
          <Route path="/boxes/*" element={<BoxesModalRouter />} />
          <Route path="/shop-names/*" element={<ShopNamesModalRouter />} />
          <Route path="/return-types/*" element={<ReturnTypesModalRouter />} />
          <Route path="/plans/*" element={<PlansModalRouter />} />
          <Route path="/product-types/*" element={<ProductTypesModalRouter />} />
          <Route path="/regions/*" element={<RegionsModalRouter />} />
          <Route path="/branch-partners/*" element={<BranchPartnersModalRouter />} />
          <Route path="/branches/*" element={<BranchesModalRouter />} />
          <Route path="/countries/*" element={<CountriesModalRouter />} />
          <Route path="/faq/*" element={<FaqModalRouter />} />
          <Route path="/news/*" element={<NewsModalRouter />} />
          <Route path="/shops/*" element={<ShopsModalRouter />} />
          <Route path="/banners/*" element={<BannersModalRouter />} />
          <Route path="/popups/*" element={<PopupsModalRouter />} />
          <Route path="/logs/*" element={<LogsModalRouter />} />
          <Route path="/customs/*" element={<CustomsModalRouter />} />
          <Route path="/united-queues/*" element={<UnitedQueuesModalRouter />} />
          <Route path="/azerpost-queues/*" element={<AzerpostQueuesModalRouter />} />
          <Route path="/failed-jobs/*" element={<FailedJobsModalRouter />} />
          <Route path="/partner-boxes/*" element={<PartnerBoxesModalRouter />} />
          <Route path="/coupons/*" element={<CouponsModalRouter />} />
          <Route path="/refunds/*" element={<RefundsModalRouter />} />
          <Route path="/status/*" element={<StatusesModalRouter />} />
          <Route path="/transactions/*" element={<TransactionsModalRouter />} />
          <Route path="/couriers/*" element={<CouriersModalRouter />} />
          <Route path="/cash-flow/*" element={<CashFlowModalRouter />} />
          <Route path="/united-returns/*" element={<UnitedReturnsModalRouter />} />
          <Route path="/branch-inspections/*" element={<BranchInspectionsModalRouter />} />
          <Route path="/supports/*" element={<SupportsModalRouter />} />
          <Route path="/orders/*" element={<OrdersModalRouter />} />
          <Route path="/statistics/*" element={<StatisticsModalRouter />} />
          <Route path="/sorting/*" element={<SortingModalRouter />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
};
