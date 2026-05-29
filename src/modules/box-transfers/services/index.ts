import { ApiResult, caller, urlMaker } from '@shared/utils';
import { BoxTransfersRequestType, IBoxTransfer } from '../interfaces';

const toDomain = (item: any): IBoxTransfer => ({
    id: item.id,
    declaration: { id: item.declaration?.id, trackCode: item.declaration?.track_code || '' },
    fromContainer: { id: item.from_container?.id, name: item.from_container?.name || '' },
    toContainer: { id: item.to_container?.id, name: item.to_container?.name || '' },
    user: { id: item.user?.id, name: item.user?.name || '' },
    branch: { id: item.branch?.id, name: item.branch?.name || '' },
    note: item.note || '',
    createdAt: item.created_at,
});

const endpointMap: Record<BoxTransfersRequestType, string> = {
    branch: '/api/admin/containers-transfers',
    declaration: '/api/admin/containers-transfers/by-declaration',
    container: '/api/admin/containers-transfers/by-container',
};

export const BoxTransfersService = {
    getList: async (
        query: Record<string, any> = {},
        type: BoxTransfersRequestType = 'branch',
    ): Promise<ApiResult<200, { data: IBoxTransfer[]; total: number }> | ApiResult<400, string>> => {
        const url = urlMaker(endpointMap[type] || endpointMap.branch, { page: 1, per_page: 20, ...query });
        try {
            const response = await caller(url);
            if (response.ok) {
                const result = await response.json();
                const data = (result.data || []).map(toDomain);
                return new ApiResult(200, { data, total: result.meta?.total ?? result.total ?? data.length }, null);
            }
            return new ApiResult(400, 'Xəta baş verdi.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },
};
