import Cookies from "js-cookie";
import { ApiResult, caller, urlMaker } from "@shared/utils";
import {
  AuthTokens,
  IMeUser,
  LoginFormData,
  LoginFormErrors,
} from "../context/types";
import { MeMappers } from "../mappers";

export class MeService {
  public static async getMe(): Promise<
    ApiResult<200, IMeUser> | ApiResult<400 | 500, string>
  > {
    const url = urlMaker("/api/client/user");

    try {
      const response = await caller(url);

      if (response.ok) {
        const data = await response.json();
        return new ApiResult(200, MeMappers.meFromApi(data), null);
      }

      return new ApiResult(400, "Məlumatlar yalnış daxil edilib.", null);
    } catch {
      return new ApiResult(500, "Şəbəkə ilə əlaqə qurula bilmədi.", null);
    }
  }

  public static async login(
    formData: LoginFormData,
  ): Promise<
    | ApiResult<200, AuthTokens>
    | ApiResult<400 | 401 | 403 | 500, string>
    | ApiResult<422, LoginFormErrors>
  > {
    const url = urlMaker("/api/admin/token");
    const body = new FormData();
    const mappedFormData = MeMappers.loginFormToApi(formData);

    Object.entries(mappedFormData).forEach(([key, value]) =>
      body.append(key, value),
    );

    try {
      const response = await caller(url, { method: "POST", body });

      if (response.ok) {
        const result = MeMappers.loginFormSuccessFromApi(await response.json());

        Cookies.set("accessToken", result.accessToken);
        Cookies.set("refreshToken", result.refreshToken);
        Cookies.set("tokenType", result.tokenType);

        return new ApiResult(200, result, null);
      }

      if (response.status === 400 || response.status === 422) {
        const { error, errors } = await response.json();

        if (error === "invalid_grant") {
          return new ApiResult(
            401,
            "İstifadəçi məlumatları yalnış daxil edilib.",
            null,
          );
        }

        if (errors) {
          return new ApiResult(
            422,
            MeMappers.loginFormErrorsFromApi(errors),
            null,
          );
        }
      }

      if (response.status === 401) {
        return new ApiResult(
          401,
          "İstifadəçi məlumatları yalnış daxil edilib.",
          null,
        );
      }

      if (response.status === 403) {
        return new ApiResult(403, "İstifadəçi qadağan edilib", null);
      }

      return new ApiResult(400, "Məlumatlar yalnış daxil edilib.", null);
    } catch {
      return new ApiResult(500, "Şəbəkə ilə əlaqə qurula bilmədi.", null);
    }
  }

  public static async logout(): Promise<void> {
    Cookies.remove("refreshToken");
    Cookies.remove("accessToken");
    Cookies.remove("tokenType");
  }
}
