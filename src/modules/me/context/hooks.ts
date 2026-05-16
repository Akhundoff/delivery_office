import Cookies from "js-cookie";
import { Dispatch, useEffect } from "react";
import { MeService } from "../services";
import { IMeState, MeAction } from "./types";

export const useBootstrapMeContext = (
  _state: IMeState,
  dispatch: Dispatch<MeAction>,
) => {
  useEffect(() => {
    const bootstrap = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        dispatch({ type: "SET_USER", payload: null });
        return;
      }

      const result = await MeService.getMe();
      if (result.status === 200) {
        dispatch({ type: "SET_USER", payload: result.data });
      } else {
        dispatch({ type: "SET_USER", payload: null });
      }
    };

    bootstrap();
  }, [dispatch]);
};
