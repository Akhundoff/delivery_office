import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IDeclarationStatisticByStatus, IOrderStatisticByStatus, ITransactionStatisticByUser, ITransactionStatisticByUserResult } from '../interfaces';

let _uuid = 0;
const uuid = () => String(++_uuid);

export class StatisticsService {
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
}
