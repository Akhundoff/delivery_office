import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ICreateTicketTemplateDto, ITicketTemplate, ITicketTemplatePersistence } from '../interfaces';
import { TicketTemplateMapper } from '../mappers';

export const TicketTemplatesService = {
    getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ITicketTemplate[]; total: number }> | ApiResult<400, string>> => {
        const url = urlMaker('/api/admin/message_templates', { page: 1, per_page: 20, ...query });
        try {
            const res = await caller(url);
            if (res.ok) {
                const result = await res.json();
                const data = (result.data as ITicketTemplatePersistence[] || []).map(TicketTemplateMapper.toDomain);
                return new ApiResult(200, { data, total: result.total ?? data.length }, null);
            }
            return new ApiResult(400, 'Xəta baş verdi.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },

    getById: async (id: number | string): Promise<ApiResult<200, ITicketTemplate> | ApiResult<400, string>> => {
        const url = urlMaker('/api/admin/message_templates/info', { message_template_id: id });
        try {
            const res = await caller(url);
            if (res.ok) {
                const result = await res.json();
                return new ApiResult(200, TicketTemplateMapper.toDomain(result.data as ITicketTemplatePersistence), null);
            }
            return new ApiResult(400, 'Xəta baş verdi.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },

    create: async (dto: ICreateTicketTemplateDto): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
        const url = urlMaker(dto.id ? '/api/admin/message_templates/edit' : '/api/admin/message_templates/create');
        try {
            const fd = new FormData();
            if (dto.id) fd.append('id', String(dto.id));
            fd.append('title', dto.name);
            fd.append('body', dto.body);
            const res = await caller(url, { method: 'POST', body: fd });
            if (res.ok) return new ApiResult(200, null, null);
            return new ApiResult(400, 'Xəta baş verdi.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },

    remove: async (id: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
        const url = urlMaker('/api/admin/message_templates/cancel', { message_template_id: id });
        try {
            const res = await caller(url, { method: 'POST' });
            if (res.ok) return new ApiResult(200, null, null);
            return new ApiResult(400, 'Xəta baş verdi.', null);
        } catch {
            return new ApiResult(400, 'Şəbəkə xətası.', null);
        }
    },
};
