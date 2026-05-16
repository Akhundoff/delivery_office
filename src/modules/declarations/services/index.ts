import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IDeclaration, IDeclarationPersistence, IDeclarationFormValues, IDeclarationPost, IDeclarationPostPersistence } from "../interfaces";
import { DeclarationMapper } from "../mappers";

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
