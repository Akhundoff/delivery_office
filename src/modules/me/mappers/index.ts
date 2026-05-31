import { AuthTokens, IMeUser, LoginApiFormData, LoginFormData, LoginFormErrors } from '../context/types';

export class MeMappers {
  public static meFromApi(raw: any): IMeUser {
    const userData = raw?.data || {};

    return {
      id: userData.id,
      firstName: userData.name,
      lastName: userData.surname,
      email: userData.email,
      permissions: Array.isArray(raw?.permissions)
        ? raw.permissions.map(({ code_name }: any) => code_name)
        : [],
      adminBranchId: userData.admin_branch_id ?? null,
    };
  }

  public static loginFormToApi(formData: LoginFormData): LoginApiFormData {
    return {
      email: formData.email,
      password: formData.password,
    };
  }

  public static loginFormErrorsFromApi(errors: Partial<Record<string, string[]>>): LoginFormErrors {
    return {
      email: errors.email,
      password: errors.password,
    };
  }

  public static loginFormSuccessFromApi(response: any): AuthTokens {
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
    };
  }
}
