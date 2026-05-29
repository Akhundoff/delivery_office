import { FC, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@modules/layout';
import { HomePage } from '../pages';
import { SuspenseSpin } from '@shared/styled/spin';

const UsersRouter = lazy(() => import('../../users/router/page.router'));
const DeclarationsRouter = lazy(() => import('../../declarations/router/page.router'));
const FlightsRouter = lazy(() => import('../../flights/router/page.router'));
const SystemSettingsRouter = lazy(() => import('../../system-settings/router/page.router'));
const CouponsRouter = lazy(() => import('../../coupons/router/page.router'));
const RefundsRouter = lazy(() => import('../../refunds/router/page.router'));
const CashbacksRouter = lazy(() => import('../../cashbacks/router/page.router'));
const CargoesRouter = lazy(() => import('../../cargoes/router/page.router'));
const BoxesRouter = lazy(() => import('../../boxes/router/page.router'));
const ShopNamesRouter = lazy(() => import('../../shop-names/router/page.router'));
const ReturnTypesRouter = lazy(() => import('../../return-types/router/page.router'));
const CountriesRouter = lazy(() => import('../../countries/router/page.router'));
const BranchesRouter = lazy(() => import('../../branches/router/page.router'));
const BranchPartnersRouter = lazy(() => import('../../branch-partners/router/page.router'));
const PlansRouter = lazy(() => import('../../plans/router/page.router'));
const ProductTypesRouter = lazy(() => import('../../product-types/router/page.router'));
const RegionsRouter = lazy(() => import('../../regions/router/page.router'));
const ModelsRouter = lazy(() => import('../../models/router/page.router'));
const StatusesRouter = lazy(() => import('../../statuses/router/page.router'));
const ArchiveStatusRouter = lazy(() => import('../../archive-status/router/page.router'));
const LogsRouter = lazy(() => import('../../logs/router/page.router'));
const NewsRouter = lazy(() => import('../../news/router/page.router'));
const FaqRouter = lazy(() => import('../../faq/router/page.router'));
const ShopsRouter = lazy(() => import('../../shops/router/page.router'));
const AboutRouter = lazy(() => import('../../about/router/page.router'));
const TransportationConditionsRouter = lazy(() => import('../../transportation-conditions/router/page.router'));
const BannersRouter = lazy(() => import('../../banners/router/page.router'));
const PopupsRouter = lazy(() => import('../../popups/router/page.router'));
const DeliveryProofsRouter = lazy(() => import('../../delivery-proofs/router/page.router'));
const CustomsRouter = lazy(() => import('../../customs/router/page.router'));
const UnitedQueuesRouter = lazy(() => import('../../united-queues/router/page.router'));
const AzerpostQueuesRouter = lazy(() => import('../../azerpost-queues/router/page.router'));
const NotifierRouter = lazy(() => import('../../notifier/router/page.router'));
const TicketTemplatesRouter = lazy(() => import('../../ticket-templates/router/page.router'));
const PartnerBoxesRouter = lazy(() => import('../../partner-boxes/router/page.router'));
const PartnerBoxAcceptanceRouter = lazy(() => import('../../partner-box-acceptance/router/page.router'));
const PartnerStatisticsRouter = lazy(() => import('../../partner-statistics/router/page.router'));
const TelegramBotUsersRouter = lazy(() => import('../../telegram-bot-users/router/page.router'));
const TransactionsRouter = lazy(() => import('../../transactions/router/page.router'));
const CouriersRouter = lazy(() => import('../../couriers/router/page.router'));
const SupportsRouter = lazy(() => import('../../supports/router/page.router'));
const UnitedDeclarationsRouter = lazy(() => import('../../united-declarations/router/page.router'));
const UnitedReturnsRouter = lazy(() => import('../../united-returns/router/page.router'));
const BranchInspectionsRouter = lazy(() => import('../../branch-inspections/router/page.router'));
const OrdersRouter = lazy(() => import('../../orders/router/page.router'));
const CashFlowRouter = lazy(() => import('../../cash-flow/router/page.router'));
const StatisticsRouter = lazy(() => import('../../statistics/router/page.router'));
const WarehouseRouter = lazy(() => import('../../warehouse/router/page.router'));
const BoxTransfersRouter = lazy(() => import('../../box-transfers/router/page.router'));
const AppointmentRouter = lazy(() => import('../../appointment/router/page.router'));
const SortingRouter = lazy(() => import('../../sorting/router/page.router'));

export const HomeRouter: FC = () => {
    return (
        <AppLayout>
            <Suspense fallback={<SuspenseSpin />}>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/users/*' element={<UsersRouter />} />
                    <Route path='/declarations/*' element={<DeclarationsRouter />} />
                    <Route path='/flights/*' element={<FlightsRouter />} />
                    <Route path='/settings/*' element={<SystemSettingsRouter />} />
                    <Route path='/coupons/*' element={<CouponsRouter />} />
                    <Route path='/refunds/*' element={<RefundsRouter />} />
                    <Route path='/cashback/*' element={<CashbacksRouter />} />
                    <Route path='/cargoes/*' element={<CargoesRouter />} />
                    <Route path='/boxes/*' element={<BoxesRouter />} />
                    <Route path='/shop-names/*' element={<ShopNamesRouter />} />
                    <Route path='/return-types/*' element={<ReturnTypesRouter />} />
                    <Route path='/countries/*' element={<CountriesRouter />} />
                    <Route path='/branches/*' element={<BranchesRouter />} />
                    <Route path='/branch-partners/*' element={<BranchPartnersRouter />} />
                    <Route path='/plans/*' element={<PlansRouter />} />
                    <Route path='/product-types/*' element={<ProductTypesRouter />} />
                    <Route path='/regions/*' element={<RegionsRouter />} />
                    <Route path='/models/*' element={<ModelsRouter />} />
                    <Route path='/status/*' element={<StatusesRouter />} />
                    <Route path='/archive/state/*' element={<ArchiveStatusRouter />} />
                    <Route path='/logs/*' element={<LogsRouter />} />
                    <Route path='/news/*' element={<NewsRouter />} />
                    <Route path='/faq/*' element={<FaqRouter />} />
                    <Route path='/shops/*' element={<ShopsRouter />} />
                    <Route path='/about/*' element={<AboutRouter />} />
                    <Route path='/transportation_conditions/*' element={<TransportationConditionsRouter />} />
                    <Route path='/banners/*' element={<BannersRouter />} />
                    <Route path='/popups/*' element={<PopupsRouter />} />
                    <Route path='/delivery-proofs/*' element={<DeliveryProofsRouter />} />
                    <Route path='/customs/*' element={<CustomsRouter />} />
                    <Route path='/united-queues/*' element={<UnitedQueuesRouter />} />
                    <Route path='/azerpost-queues/*' element={<AzerpostQueuesRouter />} />
                    <Route path='/notifier/*' element={<NotifierRouter />} />
                    <Route path='/ticket-templates/*' element={<TicketTemplatesRouter />} />
                    <Route path='/partner-boxes/*' element={<PartnerBoxesRouter />} />
                    <Route path='/partner/acceptance/box/*' element={<PartnerBoxAcceptanceRouter />} />
                    <Route path='/statistics/branches-partner/*' element={<PartnerStatisticsRouter />} />
                    <Route path='/telegram-bot-users/*' element={<TelegramBotUsersRouter />} />
                    <Route path='/transactions/*' element={<TransactionsRouter />} />
                    <Route path='/couriers/*' element={<CouriersRouter />} />
                    <Route path='/supports/*' element={<SupportsRouter />} />
                    <Route path='/united-declarations/*' element={<UnitedDeclarationsRouter />} />
                    <Route path='/united-returns/*' element={<UnitedReturnsRouter />} />
                    <Route path='/branch-inspections/*' element={<BranchInspectionsRouter />} />
                    <Route path='/orders/*' element={<OrdersRouter />} />
                    <Route path='/cash-flow/*' element={<CashFlowRouter />} />
                    <Route path='/statistics/*' element={<StatisticsRouter />} />
                    <Route path='/warehouse/*' element={<WarehouseRouter />} />
                    <Route path='/box-transfers/*' element={<BoxTransfersRouter />} />
                    <Route path='/appointment/*' element={<AppointmentRouter />} />
                    <Route path='/sorting/*' element={<SortingRouter />} />
                    <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
            </Suspense>
        </AppLayout>
    );
};

export default HomeRouter;
