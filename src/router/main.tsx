import React, { FC, lazy, Suspense, useContext } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MeContext } from '../modules/me/context/context';
import { SuspenseSpin } from '../shared/styled/spin';

const MeRouter = lazy(() => import('../modules/me/router/page.router'));
const HomeRouter = lazy(() => import('../modules/home/router'));

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
const PartnerBoxesModalRouter = lazy(() => import('../modules/partner-boxes/router/modal.router'));
const CouponsModalRouter = lazy(() => import('../modules/coupons/router/modal.router'));
const RefundsModalRouter = lazy(() => import('../modules/refunds/router/modal.router'));

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
                    <Route path='/*' element={<MeRouter />} />
                </Routes>
            </Suspense>
        );
    }

    return (
        <Suspense fallback={<SuspenseSpin />}>
            <Routes location={state?.background || location}>
                <Route path='/*' element={<HomeRouter />} />
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
            <Routes>
                <Route path='/users/*' element={<UsersModalRouter />} />
                <Route path='/declarations/*' element={<DeclarationsModalRouter />} />
                <Route path='/flights/*' element={<FlightsModalRouter />} />
                <Route path='/cargoes/*' element={<CargoesModalRouter />} />
                <Route path='/boxes/*' element={<BoxesModalRouter />} />
                <Route path='/shop-names/*' element={<ShopNamesModalRouter />} />
                <Route path='/return-types/*' element={<ReturnTypesModalRouter />} />
                <Route path='/plans/*' element={<PlansModalRouter />} />
                <Route path='/product-types/*' element={<ProductTypesModalRouter />} />
                <Route path='/regions/*' element={<RegionsModalRouter />} />
                <Route path='/branch-partners/*' element={<BranchPartnersModalRouter />} />
                <Route path='/branches/*' element={<BranchesModalRouter />} />
                <Route path='/countries/*' element={<CountriesModalRouter />} />
                <Route path='/faq/*' element={<FaqModalRouter />} />
                <Route path='/news/*' element={<NewsModalRouter />} />
                <Route path='/shops/*' element={<ShopsModalRouter />} />
                <Route path='/banners/*' element={<BannersModalRouter />} />
                <Route path='/popups/*' element={<PopupsModalRouter />} />
                <Route path='/logs/*' element={<LogsModalRouter />} />
                <Route path='/customs/*' element={<CustomsModalRouter />} />
                <Route path='/united-queues/*' element={<UnitedQueuesModalRouter />} />
                <Route path='/partner-boxes/*' element={<PartnerBoxesModalRouter />} />
                <Route path='/coupons/*' element={<CouponsModalRouter />} />
                <Route path='/refunds/*' element={<RefundsModalRouter />} />
            </Routes>
        </Suspense>
    );
};
