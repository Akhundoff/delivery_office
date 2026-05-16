import { ApiResult, caller, urlMaker } from '@shared/utils';

export const AboutService = {
    get: async (): Promise<ApiResult<200, string> | ApiResult<400, string>> => {
        try {
            const response = await caller(urlMaker('/api/client/about'));
            if (response.ok) {
                const result = await response.json();
                return new ApiResult(200, result?.data ?? '', null);
            }
            return new ApiResult(400, 'Xəta baş verdi.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },

    save: async (body: string): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
        const formData = new FormData();
        formData.append('body', body);
        try {
            const response = await caller(urlMaker('/api/admin/about/create'), { method: 'POST', body: formData });
            if (response.ok) return new ApiResult(200, null, null);
            return new ApiResult(400, 'Xəta baş verdi.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },
};
