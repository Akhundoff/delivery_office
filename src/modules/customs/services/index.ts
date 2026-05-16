import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IDnsQueue, ICustomsDeclaration, ICustomsDeclarationPersistence, ICustomsPost, ICustomsPostPersistence } from '../interfaces';

type ListResponse = { data: IDnsQueue[]; total: number };

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
