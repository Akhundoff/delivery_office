import { ApiResult, caller, urlMaker } from "@shared/utils";
import { ICountry, ICountryFormValues } from "../interfaces";

const toDomain = (item: any): ICountry => ({
  id: item.id,
  name: item.country_name || item.name || "",
  abbr: item.abbr || "",
  currency: item.currency || "",
  currencyType: item.currency_type || "",
  countryCode: item.country_code || "",
  unit: item.unit || "KG",
  address: item.address || "",
  minSize: item.min_size || 0,
  box: item.box === 1,
  isOrder: item.is_order === 1,
  isDeclaration: item.is_declaration === 1,
  fullDeclaration: item.full_declaration === 1,
  zeroPrice: item.zero_price === 1,
  zeroSend: item.zero_send === 1,
  smsConfirmation: item.sms_confirmation === 1,
  hasWarehouse: item.has_warehouse === 1,
  description: item.descr || "",
  state: item.state_id ? { id: item.state_id, name: item.state_name || "" } : null,
  createdAt: item.created_at,
});

export const CountriesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICountry[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/countries", { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total || data.length }, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, ICountry> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/countries/info", { country_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDomain(result.data), null);
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  create: async (values: ICountryFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/countries/create");
    const body = new FormData();
    body.append("country_name", values.name);
    body.append("abbr", values.abbr);
    body.append("currency", values.currency);
    body.append("currency_type", values.currencyType);
    body.append("country_code", values.countryCode);
    body.append("unit", values.unit);
    body.append("address", values.address);
    body.append("address_heading", values.addressHeading);
    body.append("min_size", values.minSize);
    body.append("box", values.box ? "1" : "0");
    body.append("is_order", values.isOrder ? "1" : "0");
    body.append("is_declaration", values.isDeclaration ? "1" : "0");
    body.append("full_declaration", values.fullDeclaration ? "1" : "0");
    body.append("zero_price", values.zeroPrice ? "1" : "0");
    body.append("zero_send", values.zeroSend ? "1" : "0");
    body.append("sms_confirmation", values.smsConfirmation ? "1" : "0");
    body.append("has_warehouse", values.hasWarehouse ? "1" : "0");
    body.append("descr", values.description);
    body.append("carrier_company_name", values.carrierCompanyName);
    body.append("carrier_company_address", values.carrierCompanyAddress);
    body.append("carrier_company_phone", values.carrierCompanyPhone);
    if (values.stateId) body.append("state_id", values.stateId);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  update: async (id: string | number, values: ICountryFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/countries/edit");
    const body = new FormData();
    body.append("country_id", String(id));
    body.append("country_name", values.name);
    body.append("abbr", values.abbr);
    body.append("currency", values.currency);
    body.append("currency_type", values.currencyType);
    body.append("country_code", values.countryCode);
    body.append("unit", values.unit);
    body.append("address", values.address);
    body.append("address_heading", values.addressHeading);
    body.append("min_size", values.minSize);
    body.append("box", values.box ? "1" : "0");
    body.append("is_order", values.isOrder ? "1" : "0");
    body.append("is_declaration", values.isDeclaration ? "1" : "0");
    body.append("full_declaration", values.fullDeclaration ? "1" : "0");
    body.append("zero_price", values.zeroPrice ? "1" : "0");
    body.append("zero_send", values.zeroSend ? "1" : "0");
    body.append("sms_confirmation", values.smsConfirmation ? "1" : "0");
    body.append("has_warehouse", values.hasWarehouse ? "1" : "0");
    body.append("descr", values.description);
    body.append("carrier_company_name", values.carrierCompanyName);
    body.append("carrier_company_address", values.carrierCompanyAddress);
    body.append("carrier_company_phone", values.carrierCompanyPhone);
    if (values.stateId) body.append("state_id", values.stateId);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  delete: async (ids: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/countries/cancel", { country_id: ids });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
