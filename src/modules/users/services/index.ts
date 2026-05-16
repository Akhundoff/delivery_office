import { ApiResult, caller, urlMaker } from "@shared/utils";
import {
  IUser,
  IUserPersistence,
  IDetailedUser,
  IDetailedUserPersistence,
  CreateUserDto,
  CreateDiscountDto,
} from "../interfaces";
import { UserMapper, DetailedUserMapper } from "../mappers";
import dayjs from "dayjs";

export const UsersService = {
  getUsers: async (
    query: Record<string, any> = {},
  ): Promise<
    ApiResult<200, { data: IUser[]; total: number }> | ApiResult<400, string>
  > => {
    const url = urlMaker("/api/admin/v2/client/list", {
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
            data: (result.data || []).map((u: IUserPersistence) =>
              UserMapper.toDomain(u),
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

  getUserById: async (
    id: string | number,
  ): Promise<ApiResult<200, IDetailedUser> | ApiResult<400 | 500, string>> => {
    const url = urlMaker("/api/admin/client/user", { user_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(
          200,
          DetailedUserMapper.toDomain(result as IDetailedUserPersistence),
          null,
        );
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(500, "Şəbəkə ilə əlaqə qurula bilmədi", null);
    }
  },

  createUser: async (
    dto: CreateUserDto,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422 | 500, string>> => {
    const url = urlMaker("/api/admin/client/create");
    const body = new FormData();
    body.append("name", dto.firstname);
    body.append("surname", dto.lastname);
    body.append("email", dto.email);
    body.append("number", dto.phoneNumber);
    body.append("gender", dto.gender);
    body.append(
      "birth_date",
      dto.birthDate ? dayjs(dto.birthDate).format("YYYY-MM-DD") : "",
    );
    body.append("address", dto.address);
    body.append("branch_id", dto.branchId);
    body.append("passport_number", dto.passport.number);
    body.append("passport_secret", dto.passport.secret);
    body.append("password", dto.password);
    body.append("password_confirmation", dto.passwordConfirmation);
    body.append("send_mail", dto.sendEmail ? "1" : "0");
    body.append("send_sms", dto.sendSms ? "1" : "0");
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) {
        const messages = Object.values(result.errors || {})
          .flat()
          .join(". ");
        return new ApiResult(422, messages || "Xəta baş verdi", null);
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(500, "Şəbəkə ilə əlaqə qurula bilmədi", null);
    }
  },

  updateUser: async (
    id: string | number,
    dto: CreateUserDto,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422 | 500, string>> => {
    const url = urlMaker("/api/admin/client/update");
    const body = new FormData();
    body.append("user_id", String(id));
    body.append("name", dto.firstname);
    body.append("surname", dto.lastname);
    body.append("email", dto.email);
    body.append("number", dto.phoneNumber);
    body.append("gender", dto.gender);
    body.append(
      "birth_date",
      dto.birthDate ? dayjs(dto.birthDate).format("YYYY-MM-DD") : "",
    );
    body.append("address", dto.address);
    body.append("branch_id", dto.branchId);
    body.append("passport_number", dto.passport.number);
    body.append("passport_secret", dto.passport.secret);
    if (dto.password) body.append("password", dto.password);
    if (dto.passwordConfirmation)
      body.append("password_confirmation", dto.passwordConfirmation);
    body.append("send_mail", dto.sendEmail ? "1" : "0");
    body.append("send_sms", dto.sendSms ? "1" : "0");
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) {
        const messages = Object.values(result.errors || {})
          .flat()
          .join(". ");
        return new ApiResult(422, messages || "Xəta baş verdi", null);
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(500, "Şəbəkə ilə əlaqə qurula bilmədi", null);
    }
  },

  deleteUser: async (
    id: string | number,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
    const url = urlMaker("/api/admin/client/delete", { user_id: id });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi", null);
    } catch {
      return new ApiResult(500, "Şəbəkə ilə əlaqə qurula bilmədi", null);
    }
  },

  getDiscountUsers: async (
    query: Record<string, any> = {},
  ): Promise<
    ApiResult<200, { data: IUser[]; total: number }> | ApiResult<400, string>
  > => {
    const url = urlMaker("/api/admin/user_discounts", {
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
            data: (result.data || []).map((u: IUserPersistence) =>
              UserMapper.toDomain(u),
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

  createDiscount: async (
    userId: string | number,
    dto: CreateDiscountDto,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422 | 500, string>> => {
    const url = urlMaker("/api/admin/users/discount");
    const body = new FormData();
    body.append("user_id", String(userId));
    body.append("discount", dto.discount);
    body.append(
      "discount_date",
      dto.discountDate ? dayjs(dto.discountDate).format("YYYY-MM-DD") : "",
    );
    if (dto.countryId) body.append("country_id", dto.countryId);
    if (dto.descr) body.append("descr", dto.descr);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) {
        const messages = Object.values(result.errors || {})
          .flat()
          .join(". ");
        return new ApiResult(422, messages || "Xəta baş verdi", null);
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(500, "Şəbəkə ilə əlaqə qurula bilmədi", null);
    }
  },
};
