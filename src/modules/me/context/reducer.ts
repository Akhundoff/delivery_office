import { IMeState, MeAction } from "./types";

export const meContextReducer = (
  state: IMeState,
  action: MeAction,
): IMeState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        user: {
          ...state.user,
          loading: action.payload,
        },
      };
    case "SET_USER":
      return {
        ...state,
        user: {
          loading: false,
          data: action.payload,
        },
      };
    case "SET_AUTH_LOADING":
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: action.payload,
        },
      };
    case "SET_AUTH_ERROR":
      return {
        ...state,
        auth: {
          ...state.auth,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};
