import { ApiResult, caller, urlMaker } from '@shared/utils';
import {
    IDeclarationStatisticByStatus,
    IOrderStatisticByAdmin,
    IOrderStatisticByAdminResult,
    IOrderStatisticByStatus,
    IStatisticAdmin,
    ITransactionStatisticByUser,
    ITransactionStatisticByUserResult,
    IUsersCountStatistic,
    IUsersCountStatisticsResult,
    ICouriersCountStatistic,
    ICouriersCountStatisticsResult,
    ICouriersCountByRegionStatistic,
    ICouriersCountByRegionStatisticsResult,
    ICouriersCountByRegionOverviewStatistic,
    ITransactionStatisticByPaymentType,
    ITransactionStatisticByPaymentTypeResult,
    IPaymentTypeStatisticByDeclaration,
    IPaymentTypeStatisticByDeclarationResult,
    ICashFlowDailyTransaction,
    ICashFlowDailyTransactionsResult,
    ITariffOverviewStatistic,
    IQizilOnluqUser,
    ICountsByStatus,
    IUsersGeneralStatistics,
    ITransactionBalanceStatistics,
} from '../interfaces';

let _uuid = 0;
const uuid = () => String(++_uuid);

export class StatisticsService {
    // Generic raw "getlist" fetcher used by drill-down modals. Returns the raw rows + total;
    // the calling use-case maps the rows into the relevant module's domain object.
    public static async getGetlist(path: string, query: Record<string, any>): Promise<ApiResult<200, { data: any[]; total: number }> | ApiResult<400 | 500, string>> {
        const url = urlMaker(path, { getlist: true, page: 1, per_page: 20, ...query });
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                return new ApiResult(200, { data: body.data || [], total: body.total || 0 }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getDeclarationsByStatus(query: { start_date?: string; end_date?: string; state_id?: number; branch_id?: number }): Promise<
        ApiResult<200, { data: IDeclarationStatisticByStatus[]; total: { count: number; deliveryPrice: number; productPrice: number } }> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/by_declarations_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: IDeclarationStatisticByStatus[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    count: item.declaration_count,
                    productPrice: parseFloat(item.price || '0'),
                    deliveryPrice: parseFloat(item.delivery_price || '0'),
                    updatedAt: item.changed_date,
                }));
                return new ApiResult(200, {
                    data,
                    total: { count: body.total?.declaration_count || 0, deliveryPrice: body.total?.delivery_price || 0, productPrice: body.total?.price || 0 },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getOrdersByStatus(query: { start_date?: string; end_date?: string; state_id?: number; country_id?: number }): Promise<
        ApiResult<200, { data: IOrderStatisticByStatus[]; total: { count: number; productPrice: number } }> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/by_orders_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: IOrderStatisticByStatus[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    count: item.order_count,
                    price: parseFloat(item.price || '0'),
                    updatedAt: item.changed_date,
                }));
                return new ApiResult(200, {
                    data,
                    total: { count: body.total?.order_count || 0, productPrice: parseFloat(body.total?.price || '0') },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getTransactionsByUser(query: { start_date?: string; end_date?: string }): Promise<
        ApiResult<200, ITransactionStatisticByUserResult> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/by_balance_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const items: ITransactionStatisticByUser[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    count: item.transaction_count,
                    amount: parseFloat(item.amount || '0'),
                    currency: item.currency,
                    createdAt: item.added_date,
                }));
                return new ApiResult(200, {
                    items,
                    total: {
                        count: body.total?.transaction_count || 0,
                        amount: { azn: body.total?.amount_azn || 0, try: body.total?.amount_try || 0, usd: body.total?.amount_usd || 0 },
                    },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getOrdersByAdmin(query: { start_date?: string; end_date?: string; admin_id?: number; country_id?: number }): Promise<
        ApiResult<200, IOrderStatisticByAdminResult> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/by_orders_admin_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const items: IOrderStatisticByAdmin[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    count: item.order_count,
                    price: parseFloat(item.price || '0'),
                    user: { id: item.user_id, name: item.user_name },
                    updatedAt: item.changed_date,
                }));
                return new ApiResult(200, {
                    items,
                    total: { count: body.total?.order_count || 0, price: parseFloat(body.total?.price || '0') },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getUsersCount(query: { start_date?: string; end_date?: string; gender?: 'male' | 'female'; start_age?: number; end_age?: number }): Promise<
        ApiResult<200, IUsersCountStatisticsResult> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/by_user_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: IUsersCountStatistic[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    count: item.user_count,
                    createdAt: item.added_date,
                }));
                const byAges = Object.entries(body.age || {}).map(([range, count]) => ({
                    from: parseInt(range.split('_')[0]),
                    to: parseInt(range.split('_')[1]) || 100,
                    count: count as number,
                }));
                return new ApiResult(200, { data, total: { byAges } }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getCouriersCount(query: { start_date?: string; end_date?: string; state_id?: number }): Promise<
        ApiResult<200, ICouriersCountStatisticsResult> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/by_courier_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: ICouriersCountStatistic[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    count: item.courier_count,
                    paymentAmounts: { cash: parseFloat(item.cash || '0'), online: parseFloat(item.online || '0') },
                    updatedAt: item.changed_date,
                }));
                return new ApiResult(200, {
                    data,
                    total: { count: body.total?.courier_count || 0, payments: { cash: parseFloat(body.total?.cash || '0'), online: parseFloat(body.total?.online || '0') } },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getCouriersCountByRegions(query: { start_date?: string; end_date?: string; state_id?: number }): Promise<
        ApiResult<200, ICouriersCountByRegionStatisticsResult> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/by_region_courier_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: ICouriersCountByRegionStatistic[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    region: { id: item.region_id, name: item.region_name },
                    count: item.courier_count,
                    paymentAmount: { azn: parseFloat(item.price_azn || '0'), usd: parseFloat(item.price || '0') },
                    updatedAt: item.changed_date,
                }));
                return new ApiResult(200, {
                    data,
                    total: { count: body.total?.courier_count || 0, paymentAmount: { azn: parseFloat(body.total?.price_azn || '0'), usd: parseFloat(body.total?.price || '0') } },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getCouriersCountByRegionsOverview(query: { start_date?: string; end_date?: string; state_id?: number }): Promise<
        ApiResult<200, ICouriersCountByRegionOverviewStatistic[]> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/courier_by_region_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: ICouriersCountByRegionOverviewStatistic[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    region: { id: item.region_id, name: item.name },
                    count: item.count,
                    paymentAmount: { azn: parseFloat(item.price_azn || '0'), usd: parseFloat(item.price || '0') },
                }));
                return new ApiResult(200, data, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getTransactionsByPaymentType(query: { start_date?: string; end_date?: string }): Promise<
        ApiResult<200, ITransactionStatisticByPaymentTypeResult> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/by_payment_type_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: ITransactionStatisticByPaymentType[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    date: item.date,
                    count: item.count,
                    price: item.price,
                    online: item.online,
                    office: item.office,
                }));
                return new ApiResult(200, {
                    data,
                    total: { count: body.total?.count || 0, office: body.total?.office || 0, online: body.total?.online || 0, price: body.total?.price || 0 },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getPaymentTypesByDeclarations(query: { start_date?: string; end_date?: string; payment_type?: number[] }): Promise<
        ApiResult<200, IPaymentTypeStatisticByDeclarationResult> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/statistics/by_declaration_count', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: IPaymentTypeStatisticByDeclaration[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    count: item.declaration_count,
                    paymentType: { id: item.payment_type, name: item.payment_type_name },
                    deliveryPrice: { azn: parseFloat(item.delivery_price_azn || '0'), usd: parseFloat(item.delivery_price || '0') },
                    paidAt: item.payed_date,
                }));
                return new ApiResult(200, {
                    data,
                    total: {
                        amount: body.total?.amount || 0,
                        declarationCount: body.total?.declaration_count || 0,
                        deliveryPrice: body.total?.delivery_price || 0,
                        byPaymentTypes: (body.total?.payment_type_total || []).map((item: any) => ({
                            id: item.payment_type_id,
                            name: item.payment_type_name,
                            deliveryPrice: item.payment_type_sum,
                        })),
                    },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getCashFlowDaily(params: {
        startDate: string;
        endDate: string;
        operationType: number;
        paymentType?: number;
        cashboxId?: number;
        cashCategoryId?: number | string;
        cashCategoryIdParent?: number | string;
    }): Promise<ApiResult<200, ICashFlowDailyTransactionsResult> | ApiResult<400 | 500, string>> {
        const url = urlMaker('/api/admin/cashbox_statistics/daily', {
            operation_date: `${params.startDate},${params.endDate}`,
            operation: params.operationType,
            payment_type: params.paymentType,
            cashbox_id: params.cashboxId,
            cash_category_id: params.cashCategoryId,
            cash_category_id_parent: params.cashCategoryIdParent,
        });
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: ICashFlowDailyTransaction[] = (body.data || []).map((item: any) => ({
                    id: uuid(),
                    count: item.count,
                    price: item.price,
                    date: item.date,
                }));
                return new ApiResult(200, { data, total: { count: body.total?.count || 0, price: body.total?.price || 0 } }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getTariffStats(query: { from_date?: string; to_date?: string; state_id?: number | string; payed?: number }): Promise<
        ApiResult<200, ITariffOverviewStatistic[]> | ApiResult<400 | 500, string>
    > {
        const url = urlMaker('/api/admin/tariff/stats', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: ITariffOverviewStatistic[] = (body.data || []).map((item: any) => ({
                    id: item.id,
                    count: item.total_declaration,
                    totalWeight: item.total_weight,
                    tariffFrom: item.tariff?.from_weight || '',
                    tariffTo: item.tariff?.to_weight || '',
                    totalDeliveryPrice: item.total_delivery_price,
                    price: item.tariff?.price || '',
                    type: item.tariff?.type || '',
                }));
                return new ApiResult(200, data, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getQizilOnluqUsers(query: Record<string, any> = {}): Promise<ApiResult<200, { data: IQizilOnluqUser[]; total: number }> | ApiResult<400 | 500, string>> {
        const url = urlMaker('/api/admin/statistics/qizilonluq', { sort_column: 'qizilonluq', sort_order: 'DESC', page: 1, per_page: 20, ...query });
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: IQizilOnluqUser[] = (body.data || []).map((user: any) => ({
                    id: user.id,
                    name: user.user_name,
                    email: user.email,
                    phoneNumber: user.number,
                    qizilonluq: user.qizilonluq,
                    balance: { usd: parseFloat(user.balance_usd || '0'), try: parseFloat(user.balance_try || '0') },
                    branch: { id: user.branch_id, name: user.branch_name },
                    discount: user.discount,
                    gender: user.gender,
                }));
                return new ApiResult(200, { data, total: body.total || data.length }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    // Counts grouped by status (POST /api/admin/charts/bystatus). dataKey: 'declarations' | 'orders'.
    public static async getCountsByStatus(modelId: number, dataKey: 'declarations' | 'orders'): Promise<ApiResult<200, ICountsByStatus[]> | ApiResult<400 | 500, string>> {
        const url = urlMaker('/api/admin/charts/bystatus', { model_id: [modelId] });
        try {
            const response = await caller(url, { method: 'POST' });
            if (response.ok) {
                const body = await response.json();
                const data: ICountsByStatus[] = (body.data?.[dataKey] || []).map((item: any) => ({ id: item.state_id, name: item.state_name, count: item.count }));
                return new ApiResult(200, data, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getUsersGeneral(): Promise<ApiResult<200, IUsersGeneralStatistics> | ApiResult<400 | 500, string>> {
        const url = urlMaker('/api/admin/charts/widget');
        try {
            const response = await caller(url, { method: 'POST' });
            if (response.ok) {
                const body = await response.json();
                return new ApiResult(200, {
                    counts: { totalClient: body.data?.clients, orderedClient: body.data?.orders },
                    balance: { usd: body.data?.balance_try?.USD, try: body.data?.balance_try?.TRY },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getTransactionBalance(): Promise<ApiResult<200, ITransactionBalanceStatistics> | ApiResult<400 | 500, string>> {
        const url = urlMaker('/api/admin/charts/balance');
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                return new ApiResult(200, {
                    todayOutcome: { usd: parseFloat(body.data?.today_expense?.USD || '0'), try: parseFloat(body.data?.today_expense?.TRY || '0') },
                    todayIncome: { usd: parseFloat(body.data?.today_popup?.USD || '0'), try: parseFloat(body.data?.today_popup?.TRY || '0') },
                    balance: { usd: parseFloat(body.data?.total?.USD || '0'), try: parseFloat(body.data?.total?.TRY || '0') },
                }, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getDeclarationsStatisticsExcel(query: { start_date?: string; end_date?: string; state_id?: number; branch_id?: number }): Promise<ApiResult<200, Blob> | ApiResult<400 | 500, string>> {
        const url = urlMaker('/api/admin/statistics/by_declarations_count/export', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const blob = await response.blob();
                return new ApiResult(200, blob, null);
            }
            return new ApiResult(400, 'Sənəd hazırlana bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    public static async getCourierPriceExcel(query: { start_date?: string; end_date?: string }): Promise<ApiResult<200, Blob> | ApiResult<400 | 500, string>> {
        const url = urlMaker('/api/admin/couriers/courier_price', query);
        try {
            const response = await caller(url);
            if (response.ok) {
                const blob = await response.blob();
                return new ApiResult(200, blob, null);
            }
            return new ApiResult(400, 'Sənəd hazırlana bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }

    // Admin users for select filters (/api/admin/users/select?admin=1)
    public static async getAdmins(): Promise<ApiResult<200, IStatisticAdmin[]> | ApiResult<400 | 500, string>> {
        const url = urlMaker('/api/admin/users/select', { admin: 1 });
        try {
            const response = await caller(url);
            if (response.ok) {
                const body = await response.json();
                const data: IStatisticAdmin[] = (body.data || []).map((user: any) => ({
                    id: user.id,
                    name: [user.name, user.surname].filter(Boolean).join(' '),
                }));
                return new ApiResult(200, data, null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
        }
    }
}
