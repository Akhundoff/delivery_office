import { Dispatch } from "react";

export interface IMeUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  permissions: string[];
  adminBranchId: number | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormData | string, string[]>>;

export type LoginApiFormData = {
  email: string;
  password: string;
};

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface IMeState {
  user: {
    loading: boolean;
    data: IMeUser | null;
  };
  auth: {
    loading: boolean;
    error: string | null;
  };
}

export type MeAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: IMeUser | null }
  | { type: "SET_AUTH_LOADING"; payload: boolean }
  | { type: "SET_AUTH_ERROR"; payload: string | null };

export interface IMeContext {
  state: IMeState;
  dispatch: Dispatch<MeAction>;
  can: (permission: string) => boolean;
}
