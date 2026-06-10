import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IDnsQueue, ICustomsDeclaration, ICustomsDeclarationPersistence, ICustomsPost, ICustomsPostPersistence, ICustomsStatus, ICustomsTask, ICustomsTaskPersistence } from '../interfaces';

type ListResponse = { data: IDnsQueue[]; total: number };

const customsTaskToDomain = (p: ICustomsTaskPersistence): ICustomsTask => ({
  id: p.id,
  action: p.action,
  status: { id: p.state_id, name: p.state_name },
  createdAt: p.created_at,
  branch: { id: p.branch_id, name: p.branch_name },
  declaration: {
    id: p.declaration_id,
    trackCode: p.track_code,
    globalTrackCode: p.global_track_code,
    weight: p.weight ? parseFloat(p.weight) : null,
    quantity: p.quantity,
    user: { id: p.user_id, name: p.user_name },
    status: { id: p.declaration_state_id, name: p.declaration_state_name },
    productType: { id: p.product_type_id, name: p.product_type_name },
    country: p.country_id ? { id: p.country_id, name: p.country_name } : null,
    updatedBy: p.changer_id && p.changer_name ? { id: p.changer_id, name: p.changer_name } : null,
  },
});

const customsDeclarationToDomain = (p: ICustomsDeclarationPersistence): ICustomsDeclaration => ({
  id: p.id,
  user: p.user_id != null ? { id: p.user_id, name: p.user_name ?? '' } : null,
  importer: { name: p.ImportName, passportSecret: p.PinNumber },
  productType: p.GoodsName,
  invoicePrice: { original: p.InvoicePriceFull, usd: p.InvoicePriceUsd },
  quantity: parseInt(p.QuantityFull, 10) || 0,
  paymentStatus: p.PayStatus,
  regNumber: p.RegNumber,
  trackingNumber: p.TrackingNumber,
  flight: p.flight_id != null ? { id: p.flight_id } : null,
  createdAt: p.created_at,
});

const customsPostToDomain = (p: ICustomsPostPersistence): ICustomsPost => ({
  id: p.id,
  direction: p.direction,
  trackingNumber: p.trackinG_NO,
  transportationCost: p.transP_COSTS,
  weight: p.weighT_GOODS,
  quantity: p.quantitY_OF_GOODS,
  importer: { name: p.idxaL_NAME, address: p.idxaL_ADRESS, fin: p.fin, voen: p.voen || null },
  exporter: { name: p.ixraC_NAME, address: p.ixraC_ADRESS },
  invoice: { price: p.invoyS_PRICE, currency: p.currencY_TYPE, azn: p.invoyS_AZN, usd: p.invoyS_USD },
  goods: (p.goodsList || []).map((g) => ({ id: g.goodS_ID, name: g.namE_OF_GOODS })),
  documentType: p.documenT_TYPE,
  airWaybill: p.airwaybill,
  dispatchNumber: p.depesH_NUMBER,
  status: p.status,
  eComRegNumber: p.ecoM_REGNUMBER,
  packageType: p.packagE_TYPE,
  dispatchedAt: p.depesH_DATE,
  createdAt: p.inserT_DATE,
});

const toDomain = (p: any): IDnsQueue => ({
  id: p.id,
  action: p.action ?? '',
  query: p.json ? (typeof p.json === 'string' ? JSON.parse(p.json) : p.json) : [],
  statusCode: p.status_code ?? null,
  response: p.response ? (typeof p.response === 'string' ? JSON.parse(p.response) : p.response) : null,
  attempts: p.attempts ?? 0,
  createdAt: p.created_at,
  updatedAt: p.updated_at ?? null,
  retriedAt: p.retry_at ?? null,
});

export const CustomsDeclarationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICustomsDeclaration[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/customs', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(customsDeclarationToDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const CustomsPostsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICustomsPost[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/customs/carriersposts', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(customsPostToDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const CustomsTasksService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICustomsTask[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/customs_tasks', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(customsTaskToDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, ICustomsTask> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/customs_tasks/info', { customs_task_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, customsTaskToDomain(result.data as ICustomsTaskPersistence), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const DnsQueuesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker('/api/customs_queues/packages', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const CustomsService = {
  getStatus: async (): Promise<ApiResult<200, ICustomsStatus>> => {
    const url = urlMaker('/api/admin/customs/ping');
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { status: result.data ? 'success' : 'error' }, null);
      }
      return new ApiResult(200, { status: 'warning' }, null);
    } catch {
      return new ApiResult(200, { status: 'warning' }, null);
    }
  },
};
