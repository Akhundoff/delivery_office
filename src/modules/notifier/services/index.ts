import { ApiResult, caller, urlMaker } from '@shared/utils';
import {
  ICreateNotificationTemplateDto,
  IEmailNotification,
  IEmailNotificationPersistence,
  INotificationTemplate,
  INotificationTemplatePersistence,
  ISendBulkEmailNotificationDto,
  ISendBulkMobileNotificationDto,
  ISendBulkSmsNotificationDto,
  ISendBulkWhatsappNotificationDto,
  ISmsNotification,
  ISmsNotificationPersistence,
} from '../interfaces';
import { EmailNotificationMapper, NotificationTemplateMapper, SmsNotificationMapper } from '../mappers';

type ListResponse<T> = { data: T[]; total: number };

const buildMobileSendBody = (dto: ISendBulkMobileNotificationDto): FormData => {
  const typeMap: Record<string, string> = {
    allUsers: 'users',
    userBirthday: 'user_birthday',
    userIds: 'user_names',
    userMonthlyLimit: 'user_limit',
    orderStatus: 'orders_state',
    declarationStatus: 'declarations_state',
    courierStatus: 'couriers_state',
    customsStatus: 'customs_state',
    flightId: 'flight_id',
  };
  const statusIds = (() => {
    if (dto.type === 'orderStatus') return dto.orderStatusIds;
    if (dto.type === 'declarationStatus') return dto.declarationStatusIds;
    if (dto.type === 'courierStatus') return dto.courierStatusIds;
    return [];
  })();

  const fd = new FormData();
  fd.append('search_id', typeMap[dto.type] ?? '');
  fd.append('template_id', dto.templateId);
  if (dto.plannedAt) fd.append('planned_at', typeof dto.plannedAt === 'string' ? dto.plannedAt : dto.plannedAt.format('YYYY-MM-DD HH:mm:ss'));
  if (dto.flightId) fd.append('flight_id', dto.flightId);
  if (dto.user.monthlyLimit) fd.append('amount', dto.user.monthlyLimit);
  if (dto.customsStatusId) fd.append('d', dto.customsStatusId);
  if (dto.customsDeclarationStatusId) fd.append('customs', dto.customsDeclarationStatusId);
  dto.user.ids.forEach((id) => fd.append('user_id[]', id));
  statusIds.forEach((id) => fd.append('state_id[]', id));
  dto.branchIds.forEach((id) => fd.append('branch_id[]', id));
  dto.countryIds.forEach((id) => fd.append('country_id[]', id));
  return fd;
};

export const SmsNotificationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse<ISmsNotification>> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/sms', {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(
          200,
          {
            data: ((result.data as ISmsNotificationPersistence[]) || []).map(SmsNotificationMapper.toDomain),
            total: result.total ?? 0,
          },
          null,
        );
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const WhatsappNotificationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse<ISmsNotification>> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/whatsapp', {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(
          200,
          {
            data: ((result.data as ISmsNotificationPersistence[]) || []).map(SmsNotificationMapper.toDomain),
            total: result.total ?? 0,
          },
          null,
        );
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const EmailNotificationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse<IEmailNotification>> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/mail', {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(
          200,
          {
            data: ((result.data as IEmailNotificationPersistence[]) || []).map(EmailNotificationMapper.toDomain),
            total: result.total ?? 0,
          },
          null,
        );
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const NotificationTemplatesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse<INotificationTemplate>> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/templates/list', {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(
          200,
          {
            data: ((result.data as INotificationTemplatePersistence[]) || []).map(NotificationTemplateMapper.toDomain),
            total: result.total ?? 0,
          },
          null,
        );
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getById: async (id: number | string): Promise<ApiResult<200, INotificationTemplate> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/templates/info', { id });
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(200, NotificationTemplateMapper.toDomain(result.data as INotificationTemplatePersistence), null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  toggleActive: async (ids: number[], isActive: boolean): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/templates/active', {
      template_id: ids,
      active: isActive ? 1 : 0,
    });
    try {
      const res = await caller(url, { method: 'POST' });
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  remove: async (id: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/templates/cancel', { template_id: id });
    try {
      const res = await caller(url, { method: 'POST' });
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  create: async (dto: ICreateNotificationTemplateDto): Promise<ApiResult<200, number> | ApiResult<400, string>> => {
    const url = urlMaker(dto.id ? '/api/admin/templates/edit' : '/api/admin/templates/create');
    try {
      const fd = new FormData();
      if (dto.id) fd.append('template_id', String(dto.id));
      fd.append('name', dto.name);
      fd.append('title', dto.title);
      fd.append('body', dto.body);
      fd.append('template_type_id', dto.typeId);
      fd.append('model_id', dto.modelId);
      fd.append('state_id', dto.statusId);
      fd.append('active', dto.isActive ? '1' : '0');
      fd.append('delay', dto.delay);
      if (dto.htmlTemplateId) fd.append('html_template_id', dto.htmlTemplateId);
      const res = await caller(url, { method: 'POST', body: fd });
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(200, dto.id || result.data, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

const buildBulkSmsBody = (dto: ISendBulkSmsNotificationDto): Record<string, any> => {
  const typeMap: Record<string, string> = {
    allUsers: 'users',
    userBirthday: 'user_birthday',
    userIds: 'user_names',
    userMonthlyLimit: 'user_limit',
    userPhoneNumbers: 'user_numbers',
    orderStatus: 'orders_state',
    declarationStatus: 'declarations_state',
    courierStatus: 'couriers_state',
    customsStatus: 'customs_state',
    flightId: 'flight_id',
  };
  const statusIds = dto.type === 'orderStatus' ? dto.orderStatusIds : dto.type === 'declarationStatus' ? dto.declarationStatusIds : dto.type === 'courierStatus' ? dto.courierStatusIds : [];
  return {
    search_id: typeMap[dto.type] ?? '',
    body: dto.body,
    planned_at: dto.plannedAt ? (dto.plannedAt.format?.('YYYY-MM-DD HH:mm:ss') ?? dto.plannedAt) : '',
    'user_id[]': dto.user.ids,
    flight_id: dto.flightId,
    amount: dto.user.monthlyLimit,
    'number[]': dto.user.phoneNumbers,
    'state_id[]': statusIds,
    customs: dto.customsDeclarationStatusId,
    d: dto.customsStatusId,
    'country_id[]': dto.countryIds,
    'branch_id[]': dto.branchIds,
  };
};

const buildBulkEmailBody = (dto: ISendBulkEmailNotificationDto): Record<string, any> => {
  const typeMap: Record<string, string> = {
    allUsers: 'users',
    userBirthday: 'user_birthday',
    userIds: 'user_names',
    userMonthlyLimit: 'user_limit',
    userEmails: 'user_emails',
    orderStatus: 'orders_state',
    declarationStatus: 'declarations_state',
    courierStatus: 'couriers_state',
    customsStatus: 'customs_state',
    flightId: 'flight_id',
  };
  const statusIds = dto.type === 'orderStatus' ? dto.orderStatusIds : dto.type === 'declarationStatus' ? dto.declarationStatusIds : dto.type === 'courierStatus' ? dto.courierStatusIds : [];
  return {
    search_id: typeMap[dto.type] ?? '',
    template_id: dto.templateId,
    planned_at: dto.plannedAt ? (dto.plannedAt.format?.('YYYY-MM-DD HH:mm:ss') ?? dto.plannedAt) : '',
    'user_id[]': dto.user.ids,
    flight_id: dto.flightId,
    amount: dto.user.monthlyLimit,
    'email[]': dto.user.emails,
    'state_id[]': statusIds,
    customs: dto.customsDeclarationStatusId,
    d: dto.customsStatusId,
    'country_id[]': dto.countryIds,
    'branch_id[]': dto.branchIds,
  };
};

const buildBulkWhatsappBody = (dto: ISendBulkWhatsappNotificationDto): Record<string, any> => {
  const typeMap: Record<string, string> = {
    allUsers: 'users',
    userBirthday: 'user_birthday',
    userIds: 'user_names',
    userMonthlyLimit: 'user_limit',
    userPhoneNumbers: 'user_numbers',
    orderStatus: 'orders_state',
    declarationStatus: 'declarations_state',
    courierStatus: 'couriers_state',
    customsStatus: 'customs_state',
    flightId: 'flight_id',
  };
  const statusIds = dto.type === 'orderStatus' ? dto.orderStatusIds : dto.type === 'declarationStatus' ? dto.declarationStatusIds : dto.type === 'courierStatus' ? dto.courierStatusIds : [];
  return {
    search_id: typeMap[dto.type] ?? '',
    template_id: dto.templateId,
    body: dto.body,
    planned_at: dto.plannedAt ? (dto.plannedAt.format?.('YYYY-MM-DD HH:mm:ss') ?? dto.plannedAt) : '',
    'user_id[]': dto.user.ids,
    flight_id: dto.flightId,
    amount: dto.user.monthlyLimit,
    'number[]': dto.user.phoneNumbers,
    'state_id[]': statusIds,
    customs: dto.customsDeclarationStatusId,
    d: dto.customsStatusId,
    'country_id[]': dto.countryIds,
    'branch_id[]': dto.branchIds,
  };
};

const buildFormData = (params: Record<string, any>): FormData => {
  const fd = new FormData();
  Object.entries(params).forEach(([key, val]) => {
    if (Array.isArray(val)) val.forEach((v) => v !== undefined && v !== '' && fd.append(key, String(v)));
    else if (val !== undefined && val !== '') fd.append(key.replace('[]', ''), String(val));
  });
  return fd;
};

export const SmsNotificationsQueueService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ISmsNotification[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/sms_queues', {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(
          200,
          {
            data: ((result.data as ISmsNotificationPersistence[]) || []).map(SmsNotificationMapper.toDomain),
            total: result.total ?? 0,
          },
          null,
        );
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  toggleIsActive: async (id: number | string, isActive: boolean): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/sms_active', {
      sms_id: id,
      active: isActive ? 1 : 0,
    });
    try {
      const res = await caller(url);
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  sendAll: async (): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/send_sms');
    try {
      const res = await caller(url, { method: 'POST' });
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  getStatus: async (id: number | string): Promise<ApiResult<200, string> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/sms_status', { sms_id: id });
    try {
      const res = await caller(url);
      if (res.ok) return new ApiResult(200, await res.text(), null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const EmailNotificationsQueueService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IEmailNotification[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/mail_queues', {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(
          200,
          {
            data: ((result.data as IEmailNotificationPersistence[]) || []).map(EmailNotificationMapper.toDomain),
            total: result.total ?? 0,
          },
          null,
        );
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  toggleIsActive: async (id: number | string, isActive: boolean): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/mail_active', {
      mail_id: id,
      active: isActive ? 1 : 0,
    });
    try {
      const res = await caller(url);
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  sendAll: async (): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/send_mail');
    try {
      const res = await caller(url, { method: 'POST' });
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const WhatsappNotificationsQueueService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ISmsNotification[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/whatsapp_queues', {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(
          200,
          {
            data: ((result.data as ISmsNotificationPersistence[]) || []).map(SmsNotificationMapper.toDomain),
            total: result.total ?? 0,
          },
          null,
        );
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  toggleIsActive: async (id: number | string, isActive: boolean): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/whatsapp_active', {
      whatsapp_id: id,
      active: isActive ? 1 : 0,
    });
    try {
      const res = await caller(url);
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  sendAll: async (): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/send_whatsapp');
    try {
      const res = await caller(url, { method: 'POST' });
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  getStatus: async (id: number | string): Promise<ApiResult<200, string> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/archive/whatsapp_status', {
      whatsapp_id: id,
    });
    try {
      const res = await caller(url);
      if (res.ok) return new ApiResult(200, await res.text(), null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const SmsBalanceService = {
  getBalance: async (): Promise<ApiResult<200, number> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/sms_balance');
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(200, result.data?.obj ?? 0, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const BulkSmsNotificationService = {
  getUsers: async (dto: ISendBulkSmsNotificationDto): Promise<ApiResult<200, { data: any[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/bulk_sms/getlist', buildBulkSmsBody(dto));
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        const data = typeof result.data === 'number' ? [] : (result.data ?? []);
        const total = typeof result.data === 'number' ? result.data : data.length;
        return new ApiResult(200, { data, total }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  send: async (dto: ISendBulkSmsNotificationDto): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/bulk_sms/send');
    try {
      const res = await caller(url, {
        method: 'POST',
        body: buildFormData(buildBulkSmsBody(dto)),
      });
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const BulkEmailNotificationService = {
  export: async (dto: ISendBulkEmailNotificationDto): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/bulk_mail/export', buildBulkEmailBody(dto));
    try {
      const res = await caller(url);
      if (res.ok) {
        const blob = await res.blob();
        window.open(URL.createObjectURL(blob), '_blank');
        return new ApiResult(200, null, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getUsers: async (dto: ISendBulkEmailNotificationDto): Promise<ApiResult<200, { data: any[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/bulk_mail/getlist', buildBulkEmailBody(dto));
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        const data = typeof result.data === 'number' ? [] : (result.data ?? []);
        const total = typeof result.data === 'number' ? result.data : data.length;
        return new ApiResult(200, { data, total }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  send: async (dto: ISendBulkEmailNotificationDto): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/bulk_mail/send');
    try {
      const res = await caller(url, {
        method: 'POST',
        body: buildFormData(buildBulkEmailBody(dto)),
      });
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const BulkWhatsappNotificationService = {
  getUsers: async (dto: ISendBulkWhatsappNotificationDto): Promise<ApiResult<200, { data: any[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/bulk_whatsapp/getlist', buildBulkWhatsappBody(dto));
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        const data = typeof result.data === 'number' ? [] : (result.data ?? []);
        const total = typeof result.data === 'number' ? result.data : data.length;
        return new ApiResult(200, { data, total }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
  send: async (dto: ISendBulkWhatsappNotificationDto): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/bulk_whatsapp/send');
    try {
      const res = await caller(url, {
        method: 'POST',
        body: buildFormData(buildBulkWhatsappBody(dto)),
      });
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const BulkMobileNotificationService = {
  getUsers: async (dto: ISendBulkMobileNotificationDto): Promise<ApiResult<200, { data: any[]; total: number }> | ApiResult<400, string>> => {
    const fd = buildMobileSendBody(dto);
    const params: Record<string, any> = {};
    fd.forEach((v, k) => {
      params[k] = v;
    });
    const url = urlMaker('/api/admin/bulk_notification/getlist', params);
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        const data = typeof result.data.data === 'number' ? [] : (result.data.data ?? []);
        const total = typeof result.data.data === 'number' ? result.data.data : data.length;
        return new ApiResult(200, { data, total }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  send: async (dto: ISendBulkMobileNotificationDto): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/bulk_notification/send');
    try {
      const res = await caller(url, {
        method: 'POST',
        body: buildMobileSendBody(dto),
      });
      if (res.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const StatusesByModelService = {
  getListByModelId: async (modelId: number | string): Promise<ApiResult<200, { id: number; name: string }[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/states/getlistbymodelid', {
      model_id: modelId,
    });
    try {
      const res = await caller(url);
      if (res.ok) {
        const result = await res.json();
        return new ApiResult(200, result.data ?? [], null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
