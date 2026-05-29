import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IDeclaration, IDeclarationPersistence, IDeclarationFormValues, IDeclarationPost, IDeclarationPostPersistence, IUnknownDeclaration, IUnknownDeclarationPersistence, IPartnerDeclaration, IPartnerDeclarationPersistence } from "../interfaces";
import { DeclarationMapper } from "../mappers";

export type IHandoverDetails = {
  user: { id: number; name: string };
  ordersPrice: { try: number; azn: number };
  deliveryPrice: { usd: number; azn: number };
  balance: { usd: number; try: number };
  debt: {
    total: { usd: number; azn: number };
    minimum: { azn: number };
    all: { azn: number; package: number };
  };
};

export type IReturnDetails = {
  id: number;
  deliveryPrice: number;
  productPriceToBeRefunded: number;
  deliveryPriceToBeRefunded: number;
  paid: boolean;
  order: { id: number; amountToBeRefunded: number; amountToBeRefundedExtra: number; amountToBeRefundedWithExtra: number } | null;
};

const unknownDeclarationToDomain = (p: IUnknownDeclarationPersistence): IUnknownDeclaration => ({
  id: p.id,
  globalTrackCode: p.global_track_code,
  trackCode: p.track_code,
  status: { id: p.state_id, name: p.state_name },
  user: p.user_id ? { id: p.user_id, name: p.user_name ?? '' } : null,
  weight: p.weight ? parseFloat(p.weight) : null,
  price: p.price ? parseFloat(p.price) : null,
  currency: p.currency ?? null,
  deliveryPrice: p.delivery_price ? parseFloat(p.delivery_price) : null,
  height: p.height ? parseFloat(p.height) : null,
  width: p.width ? parseFloat(p.width) : null,
  depth: p.depth ? parseFloat(p.depth) : null,
  voen: p.voen ?? null,
  shop: p.shop_name ?? '',
  quantity: p.quantity ?? 1,
  type: p.type === 1 ? 'liquid' : 'other',
  description: p.descr ?? '',
  file: p.document_file ?? null,
  paid: !!p.payed,
  approved: !!p.customs,
  returned: !!p.return,
  read: p.is_new === 0,
  countryId: p.country_id ?? null,
  wardrobeNumber: p.wardrobe_number ?? null,
  productType: p.product_type_id ? { id: p.product_type_id, name: p.product_type_name ?? '' } : null,
  planCategory: p.tariff_category_id ? { id: p.tariff_category_id, name: p.tariff_category_name ?? '' } : null,
  parcel: p.basket_id ? { id: p.basket_id } : null,
  basket: p.basket_id ? { id: p.basket_id, name: p.basket_name ?? '' } : null,
  box: p.container_id ? { id: p.container_id, name: p.container_name ?? '' } : null,
  lastBox: p.container_id_tmp ? { id: p.container_id_tmp, name: p.container_name_tmp ?? '' } : null,
  branch: p.branch_id ? { id: p.branch_id, name: p.branch_name ?? '' } : null,
  flight: p.flight_name ? { id: 0, name: p.flight_name } : null,
  deliveryPoint: p.delivery_point_id ? { id: p.delivery_point_id, name: p.delivery_point_name ?? '' } : null,
  partnerName: p.partner_name ?? '',
  partnerId: p.partner_id ?? null,
  handoverTaskId: p.handover_task_id ?? null,
  createdAt: p.created_at,
  deliveredAt: p.delivered_at ?? null,
});

const declarationPostToDomain = (p: IDeclarationPostPersistence): IDeclarationPost => ({
  id: p.id,
  read: p.is_new === 0,
  price: p.price != null ? parseFloat(p.price) : null,
  dgkPrice: p.dgk_price != null ? parseFloat(p.dgk_price) : null,
  user: { id: p.user_id, name: p.user_name },
  trackCode: p.track_code,
  declarationId: p.declaration_id,
  customsId: p.customs_id,
  createdAt: p.created_at,
});

export const DeclarationsService = {
  getDeclarations: async (
    query: Record<string, any> = {},
  ): Promise<
    | ApiResult<200, { data: IDeclaration[]; total: number }>
    | ApiResult<400, string>
  > => {
    const url = urlMaker("/api/admin/v2/declaration/list", {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(
          200,
          {
            data: (result.data || []).map((d: IDeclarationPersistence) =>
              DeclarationMapper.toDomain(d),
            ),
            total: result.total || 0,
          },
          null,
        );
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  getDeclarationById: async (
    id: string | number,
  ): Promise<ApiResult<200, IDeclaration> | ApiResult<400 | 500, string>> => {
    const url = urlMaker("/api/admin/declaration/info", { declaration_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, DeclarationMapper.toDomain(result.data as IDeclarationPersistence), null);
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(500, "Şəbəkə xətası.", null);
    }
  },

  createDeclaration: async (
    values: IDeclarationFormValues,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/declaration/create");
    const body = new FormData();
    body.append("user_id", values.userId);
    body.append("measure_id", "1");
    body.append("global_track_code", values.globalTrackCode);
    body.append("product_type_id", values.productTypeId);
    body.append("quantity", values.quantity);
    body.append("is_special", Number(values.isSpecial).toString());
    body.append("is_commercial", Number(values.isCommercial).toString());
    body.append("tariff_category_id", values.planTypeId || "");
    body.append("type", values.isLiquid ? "1" : "2");
    body.append("descr", values.description);
    body.append("weight", values.weight);
    body.append("country_id", values.countryId);
    body.append("branch_id", values.branchId);
    body.append("price", values.price);
    body.append("voen", values.voen);
    body.append("wardrobe_number", values.wardrobeNumber);
    body.append("delivery_price", values.deliveryPrice);
    body.append("shop_name", values.shop);
    if (values.file) body.append("document_file", values.file);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) {
        return new ApiResult(200, null, null);
      }
      const result = await response.json();
      if (response.status === 422) {
        return new ApiResult(422, result.errors || {}, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  updateDeclaration: async (
    id: string | number,
    values: IDeclarationFormValues,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/declaration/edit");
    const body = new FormData();
    body.append("declaration_id", String(id));
    body.append("user_id", values.userId);
    body.append("measure_id", "1");
    body.append("global_track_code", values.globalTrackCode);
    body.append("product_type_id", values.productTypeId);
    body.append("quantity", values.quantity);
    body.append("is_special", Number(values.isSpecial).toString());
    body.append("is_commercial", Number(values.isCommercial).toString());
    body.append("tariff_category_id", values.planTypeId || "");
    body.append("type", values.isLiquid ? "1" : "2");
    body.append("descr", values.description);
    body.append("weight", values.weight);
    body.append("country_id", values.countryId);
    body.append("branch_id", values.branchId);
    body.append("price", values.price);
    body.append("voen", values.voen);
    body.append("container_id", values.boxId);
    body.append("wardrobe_number", values.wardrobeNumber);
    body.append("delivery_price", values.deliveryPrice);
    body.append("shop_name", values.shop);
    if (values.file) body.append("document_file", values.file);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) {
        return new ApiResult(200, null, null);
      }
      const result = await response.json();
      if (response.status === 422) {
        return new ApiResult(422, result.errors || {}, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  cancelDeclarations: async (
    ids: (string | number)[],
  ): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/declaration/cancel", { declaration_id: ids });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) {
        return new ApiResult(200, null, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  pay: async (ids: (string | number)[], amount: string, paymentTypeId: string, cashboxId: string): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/declaration/pay');
    const body = new FormData();
    ids.forEach((id) => body.append('declaration_id[]', String(id)));
    body.append('amount', amount);
    body.append('payment_type_id', paymentTypeId);
    body.append('cashbox_id', cashboxId);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 422) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  bulkHandover: async (stateId: string, tariffCategoryId: string): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/declaration/handover');
    const body = new FormData();
    body.append('state_id', stateId);
    body.append('tariff_category_id', tariffCategoryId);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 422) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getPaymentTypes: async (): Promise<ApiResult<200, { id: number; name: string }[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/payment_types/list', { per_page: 1000 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map((p: any) => ({ id: p.id, name: p.name })), null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getProductTypes: async (): Promise<ApiResult<200, { id: number; name: string }[]> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/product-types/getlist", { per_page: 1000 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map((p: any) => ({ id: p.id, name: p.name })), null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  getPlanCategories: async (): Promise<ApiResult<200, { id: number; name: string }[]> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/tariff/category_list", { per_page: 1000 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map((p: any) => ({ id: p.id, name: p.name })), null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  cancelDispatch: async (id: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/flights/canceldepesh", { declaration_id: id });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const errors = result?.errors ? Object.values(result.errors).flat().join(". ") : "Xəta baş verdi.";
      return new ApiResult(400, errors as string, null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  removeFromFlight: async (id: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/warehouse/flights/remove_item", { declaration_id: id });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const errors = result?.errors ? Object.values(result.errors).flat().join(". ") : "Xəta baş verdi.";
      return new ApiResult(400, errors as string, null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  removeFromContainer: async (id: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/containers-transfers/remove-from-container", { declaration_id: id });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const errors = result?.errors ? Object.values(result.errors).flat().join(". ") : "Xəta baş verdi.";
      return new ApiResult(400, errors as string, null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  toggleWanted: async (id: string | number, descr: string | null): Promise<ApiResult<200, { result: boolean; message?: string }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/declaration/wanted/toggle", { declaration_id: id });
    const body = new FormData();
    if (descr) body.append("descr", descr);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, result, null);
      }
      const result = await response.json();
      return new ApiResult(400, result?.message || "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  getOrderIds: async (id: string | number): Promise<ApiResult<200, string[]> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/declaration/orders", { declaration_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, result.data || [], null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  getHandoverDetails: async (
    ids: (string | number)[],
    packages?: { small_package?: string; medium_package?: string; big_package?: string },
  ): Promise<ApiResult<200, IHandoverDetails> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/declaration/pay', { declaration_id: ids });
    const body = new FormData();
    if (packages) {
      if (packages.small_package) body.append('small_package', packages.small_package);
      if (packages.medium_package) body.append('medium_package', packages.medium_package);
      if (packages.big_package) body.append('big_package', packages.big_package);
    }
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) {
        const result = await response.json();
        const d = result.data;
        return new ApiResult(200, {
          user: { id: d.user_id, name: d.user_name },
          ordersPrice: { try: d.values.credit_try, azn: d.converted.credit_try },
          deliveryPrice: { usd: d.values.credit_delivery, azn: d.converted.credit_delivery },
          balance: { usd: d.values.balance_usd, try: d.values.balance_try },
          debt: {
            total: { usd: d.values.credit_usd, azn: d.converted.credit_usd },
            minimum: { azn: d.converted.minimal },
            all: { azn: d.converted.all_credit, package: d.converted.package_amount },
          },
        }, null);
      }
      const result = await response.json();
      const errors = result?.errors ? Object.values(result.errors).flat().join('. ') : 'Xəta baş verdi.';
      return new ApiResult(400, errors as string, null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  handover: async (
    ids: (string | number)[],
    data: { cash: string; terminal: string; accepted: boolean; handover_task: boolean; redirect_to_balance: boolean; small_package: string; medium_package: string; big_package: string; confirm: boolean },
  ): Promise<ApiResult<200, { handover_task_id?: number }> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/declaration/pay');
    const body = new FormData();
    ids.forEach((id) => body.append('declaration_id[]', String(id)));
    body.append('cash', data.cash);
    body.append('terminal', data.terminal);
    body.append('accepted', data.accepted ? '1' : '0');
    body.append('handover_task', data.handover_task ? '1' : '0');
    body.append('redirect_to_balance', data.redirect_to_balance ? '1' : '0');
    body.append('small_package', data.small_package);
    body.append('medium_package', data.medium_package);
    body.append('big_package', data.big_package);
    body.append('confirm', data.confirm ? '1' : '0');
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, result.data || {}, null);
      }
      const result = await response.json();
      if (response.status === 422) return new ApiResult(422, result.errors || {}, null);
      const errors = result?.errors ? Object.values(result.errors).flat().join('. ') : 'Xəta baş verdi.';
      return new ApiResult(400, errors as string, null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getReturnDetails: async (id: string | number): Promise<ApiResult<200, IReturnDetails> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/returns/run', { declaration_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const d = result.data;
        return new ApiResult(200, {
          id: d.declaration.id,
          deliveryPrice: d.declaration.delivery_price ? parseFloat(d.declaration.delivery_price) : 0,
          productPriceToBeRefunded: d.declaration.money_back_price ? parseFloat(String(d.declaration.money_back_price)) : 0,
          deliveryPriceToBeRefunded: d.declaration.money_back ? parseFloat(String(d.declaration.money_back)) : 0,
          paid: !!d.declaration.payed,
          order: d.order?.exist
            ? { id: d.order.id, amountToBeRefunded: d.order.money_back, amountToBeRefundedExtra: d.order.money_back_percent, amountToBeRefundedWithExtra: d.order.money_back_with_percent }
            : null,
        }, null);
      }
      const result = await response.json();
      const errors = result?.errors ? Object.values(result.errors).flat().join('. ') : 'Xəta baş verdi.';
      return new ApiResult(400, errors as string, null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  returnDeclaration: async (
    id: string | number,
    data: { typeId: string; returnOrderExtra: boolean; returnDeclarationPrice: boolean; returnDeliveryPrice: boolean },
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/returns/run');
    const body = new FormData();
    body.append('declaration_id', String(id));
    body.append('return_reason_id', data.typeId);
    body.append('return_order_extra', data.returnOrderExtra ? '1' : '0');
    body.append('return_declaration_price', data.returnDeclarationPrice ? '1' : '0');
    body.append('return_delivery_price', data.returnDeliveryPrice ? '1' : '0');
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 422 || response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const DeletedDeclarationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IDeclaration[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/customs/deleteddeclarations', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map((d: IDeclarationPersistence) => DeclarationMapper.toDomain(d));
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const PostDeclarationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IDeclarationPost[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/post_declarations', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(declarationPostToDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const UnknownDeclarationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IUnknownDeclaration[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/v2/conflicted_declaration/list', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(unknownDeclarationToDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, IUnknownDeclaration> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/conflicted_declaration/info', { conflicted_declaration_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, unknownDeclarationToDomain(result.data as IUnknownDeclarationPersistence), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  cancel: async (ids: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/conflicted_declaration/cancel', { conflicted_declaration_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  accept: async (id: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/conflicted_declaration/accept');
    const body = new FormData();
    body.append('conflicted_declaration_id', String(id));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

const partnerDeclarationToDomain = (p: IPartnerDeclarationPersistence): IPartnerDeclaration => ({
  id: p.id,
  user: { id: p.user_id, name: p.user_name },
  partner: { id: p.partner_id ?? 0, name: p.partner_name ?? '' },
  trackCode: p.track_code,
  globalTrackCode: p.global_track_code,
  status: { id: p.state_id, name: p.state_name },
  flight: p.flight_id ? { id: p.flight_id, name: p.flight_name ?? '' } : null,
  box: p.container_id ? { id: p.container_id, name: p.container_name ?? '' } : null,
  lastBox: p.container_id_tmp ? { id: p.container_id_tmp, name: p.container_name_tmp ?? '' } : null,
  branch: p.branch_id ? { id: p.branch_id, name: p.branch_name ?? '' } : null,
  weight: p.weight ? parseFloat(p.weight) : null,
  price: p.price ? parseFloat(p.price) : null,
  deliveryPrice: p.delivery_price ? parseFloat(p.delivery_price) : null,
  quantity: p.quantity ?? 1,
  type: p.type === 1 ? 'liquid' : 'other',
  planCategory: p.tariff_category_id ? { id: p.tariff_category_id, name: p.tariff_category_name ?? '' } : null,
  shop: p.shop_name ?? '',
  productType: p.product_type_id ? { id: p.product_type_id, name: p.product_type_name ?? '' } : null,
  parcel: p.basket_id ? { id: p.basket_id } : null,
  basket: p.basket_id ? { id: p.basket_id, name: p.basket_name ?? '' } : null,
  voen: p.voen ?? null,
  wardrobeNumber: p.wardrobe_number ?? '',
  editedBy: p.causer_id ? { id: p.causer_id, name: p.causer_name ?? '' } : null,
  document: p.document_file ?? null,
  file: p.document_file ?? null,
  read: p.is_new === 0,
  paid: !!p.payed,
  approved: !!p.customs,
  returned: !!p.return,
  height: p.height ? parseFloat(p.height) : null,
  width: p.width ? parseFloat(p.width) : null,
  depth: p.depth ? parseFloat(p.depth) : null,
  description: p.descr ?? null,
  countryId: p.country_id ?? 0,
  customs: p.customs ?? 0,
  createdAt: p.created_at,
});

export const ArchivedDeclarationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IDeclaration[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/declaration/archive', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map((d: IDeclarationPersistence) => DeclarationMapper.toDomain(d)), total: result.total || 0 }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};

export const PartnerDeclarationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IPartnerDeclaration[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/declaration/partner_declarations', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(partnerDeclarationToDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getExcel: async (query: Record<string, any> = {}, mini = false): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/declaration/export', { ...query, only_partner: 1, ...(mini ? { mini: 1 } : {}) });
    try {
      const response = await caller(url);
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Export uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
