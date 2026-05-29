import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ICreateSupportCategoryFormValues, ICreateSupportFormValues, ISupport, ISupportCategory, ISupportDetails, ISupportMessageTemplate, ISupportSelectUser } from '../interfaces';

const toDomain = (p: any): ISupport => ({
  id: p.id,
  category: { id: p.ticket_category_id, name: p.ticket_category_name || '' },
  client: { id: p.user_id, name: p.user_name || '' },
  executor: p.user_id_admin ? { id: p.user_id_admin, name: p.user_name_admin || '' } : null,
  counts: { new: parseInt(p.new_message_count) || 0, all: p.all_message_count || 0 },
  status: { id: p.state_id, name: p.state_name || '' },
  read: !p.is_new_admin,
  createdAt: p.created_at || '',
  updatedAt: p.updated_at || '',
});

const detailsToDomain = (raw: any): ISupportDetails => ({
  id: raw.ticket.id,
  category: { id: raw.ticket.ticket_category_id, name: raw.ticket.ticket_category_name },
  status: { id: raw.ticket.state_id, name: raw.ticket.state_name },
  client: { id: raw.ticket.user_id, name: raw.ticket.user_name },
  read: !!raw.ticket.is_new_admin,
  createdAt: raw.ticket.created_at,
  messages: (raw.data || []).map((m: any) => ({
    id: m.id,
    message: m.message,
    sender: {
      name: m.user_name,
      role: m.admin === 0 ? 'client' : m.admin === 1 ? 'admin' : 'warehouseman',
    },
    createdAt: m.created_at,
    documents:
      m.document_file
        ?.split(',')
        .filter(Boolean)
        .map((file: string) => {
          const [extension] = file.split('.').reverse();
          const [name] = file.split('/').reverse()[0].split('.');
          return { name, extension, url: file };
        }) || [],
  })),
});

const categoryToDomain = (c: any): ISupportCategory => ({ id: c.id, name: c.name, hidden: !!c.hidden });

export const SupportsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ISupport[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/tickets/list', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map(toDomain), total: result.total || 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, ISupportDetails> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/tickets/info', { ticket_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, detailsToDomain(result), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  changeStatus: async (ids: number[], statusId: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/tickets/changestate', { ticket_id: ids, state_id: statusId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Status dəyişdirilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  toggleRead: async (ids: number[], read: boolean): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/tickets/is_new', { ticket_id: ids, value: !read });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  cancel: async (ids: number[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/tickets/cancel', { ticket_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Silmə uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  create: async (values: ICreateSupportFormValues, id?: string): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker(id ? '/api/admin/tickets/edit' : '/api/admin/tickets/create');
    const body = new FormData();
    if (id) body.append('ticket_id', id);
    body.append('user_id', values.userId);
    body.append('ticket_category_id', values.categoryId);
    body.append('message', values.body);
    values.files.forEach((file, i) => body.append(`document_file[${i}]`, file));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json().catch(() => ({}));
      if (response.status === 400 || response.status === 422) {
        const errors: Record<string, string> = {};
        const map: Record<string, string> = { user_id: 'userId', ticket_category_id: 'categoryId', message: 'body', document_file: 'files' };
        Object.entries(result.errors || {}).forEach(([k, v]) => {
          errors[map[k] || k] = (Array.isArray(v) ? v.join('. ') : String(v)) as string;
        });
        return new ApiResult(422, errors, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  createMessage: async (ticketId: string, bodyText: string, files: File[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/tickets/message/create');
    const body = new FormData();
    body.append('ticket_id', ticketId);
    body.append('message', bodyText);
    files.forEach((file, i) => body.append(`document_file[${i}]`, file));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json().catch(() => ({}));
      return new ApiResult(400, Object.values(result.errors || {}).flat().join('. ') || 'Mesaj göndərilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  deleteMessage: async (messageId: number | string): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/tickets/cancel_message', { 'ticket_message_id[]': messageId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Mesaj silinə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getCategories: async (): Promise<ApiResult<200, { data: ISupportCategory[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/tickets/categories', { per_page: 1000 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map(categoryToDomain), total: result.total || 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  createCategory: async (values: ICreateSupportCategoryFormValues): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker(values.id ? '/api/admin/tickets/edit_category' : '/api/admin/tickets/create_category');
    const body = new FormData();
    if (values.id) body.append('ticket_category_id', values.id);
    body.append('name', values.name);
    body.append('hidden', Number(values.hidden).toString());
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json().catch(() => ({}));
      return new ApiResult(400, Object.values(result.errors || {}).flat().join('. ') || 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getMessageTemplates: async (): Promise<ApiResult<200, ISupportMessageTemplate[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/message_templates', { per_page: 1000 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map((t: any) => ({ id: t.id, title: t.title, body: t.body, createdAt: t.created_at || '' })), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getSelectUsers: async (search?: string): Promise<ApiResult<200, ISupportSelectUser[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/users/select', search ? { search } : {});
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map((u: any) => ({ id: u.id, firstname: u.name ?? u.firstname ?? '', lastname: u.surname ?? u.lastname ?? '' })), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },
};
