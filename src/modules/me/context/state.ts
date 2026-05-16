import { IMeState } from "./types";

export const initialMeContextState: IMeState = {
  user: {
    loading: true,
    data: null,
  },
  auth: {
    loading: false,
    error: null,
  },
};
