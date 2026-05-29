import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IDetailedHandoverQueue, IDetailedHandoverQueueDeclaration, IHandoverQueue } from '../interfaces';

const detailedToDomain = (item: any): IDetailedHandoverQueue => {
    const declarations: IDetailedHandoverQueueDeclaration[] = (item.declarations || []).map((d: any) => ({
        id: d.declaration_id,
        trackCode: d.track_code,
        globalTrackCode: d.global_track_code,
        wardrobeNumber: d.wardrobe_number,
        trendyol: d.trendyol,
        partnerId: d.partner_id || null,
        box: d.container_id && d.container_name ? { id: d.container_id, name: d.container_name } : null,
        productType: d.product_type_id && d.product_type_name ? { id: d.product_type_id, name: d.product_type_name } : null,
        shop: d.shop_name || '',
        weight: d.weight ? parseFloat(d.weight) : null,
    }));

    const boxMap = new Map<number, { id: number; name: string; items: IDetailedHandoverQueueDeclaration[] }>();
    declarations.forEach((d) => {
        const boxId = d.box?.id || 0;
        if (!boxMap.has(boxId)) boxMap.set(boxId, { id: boxId, name: d.box?.name || 'Digər', items: [] });
        boxMap.get(boxId)!.items.push(d);
    });

    return {
        id: item.id,
        user: { id: item.user_id, fullName: item.user_name || '' },
        cashier: { id: item.cashier_id, fullName: item.cashier_name || '' },
        status: { id: item.state_id, name: item.state_name || '' },
        packages: {
            bigPackage: item.packages?.big_package || 0,
            mediumPackage: item.packages?.medium_package || 0,
            smallPackage: item.packages?.small_package || 0,
        },
        createdAt: item.created_at,
        declarations,
        boxes: Array.from(boxMap.values()),
    };
};

const toDomain = (item: any): IHandoverQueue => ({
    id: item.id,
    user: { id: item.user_id, fullName: item.user_name || '' },
    cashier: { id: item.cashier_id, fullName: item.cashier_name || '' },
    declarations: (item.declarations || []).map((d: any) => ({
        id: d.declaration_id,
        trackCode: d.track_code,
        wardrobeNumber: d.wardrobe_number || null,
        box: d.container_id ? { id: d.container_id, name: d.container_name || '' } : null,
    })),
    status: { id: item.state_id, name: item.state_name || '' },
    createdAt: item.created_at,
});

export const WarehouseService = {
    getHandoverQueues: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IHandoverQueue[]; total: number }> | ApiResult<400, string>> => {
        const url = urlMaker('/api/admin/handover/list', { page: 1, per_page: 20, ...query });
        try {
            const response = await caller(url);
            if (response.ok) {
                const result = await response.json();
                const data = (result.data || []).map(toDomain);
                return new ApiResult(200, { data, total: result.total || data.length }, null);
            }
            return new ApiResult(400, 'Xəta baş verdi.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },

    updateHandoverQueueStatus: async (queueId: number | string, statusId: number | string): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
        const url = urlMaker('/api/admin/handover/state', { handover_task_id: queueId, state_id: statusId });
        try {
            const response = await caller(url, { method: 'POST' });
            if (response.ok) return new ApiResult(200, null, null);
            return new ApiResult(400, 'Əməliyyat uğursuz oldu.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },

    removeHandoverQueue: async (queueIds: (number | string)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
        const url = urlMaker('/api/admin/handover/cancel', { handover_task_id: queueIds });
        try {
            const response = await caller(url, { method: 'POST' });
            if (response.ok) return new ApiResult(200, null, null);
            return new ApiResult(400, 'Silmə uğursuz oldu.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },

    getHandoverQueue: async (id: string | number): Promise<ApiResult<200, IDetailedHandoverQueue> | ApiResult<400, string>> => {
        const url = urlMaker('/api/admin/handover/info', { handover_task_id: id });
        try {
            const response = await caller(url);
            if (response.ok) {
                const result = await response.json();
                return new ApiResult(200, detailedToDomain(result.data ?? result), null);
            }
            return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },

    removeHandoverQueueItem: async (queueId: string | number, declarationId: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
        const url = urlMaker('/api/admin/handover/cancelitem', { handover_task_id: queueId, declaration_id: declarationId });
        try {
            const response = await caller(url, { method: 'POST' });
            if (response.ok) return new ApiResult(200, null, null);
            return new ApiResult(400, 'Bağlama silinə bilmədi.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },
};
