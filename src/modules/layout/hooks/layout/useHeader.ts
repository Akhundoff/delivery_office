import { useCallback, useContext, useMemo } from "react";
import { message } from "antd";
import { LayoutContext } from "../../context";
import { MeContext } from "@modules/me/context/context";
import { MeService } from "@modules/me/services";

export const useHeader = () => {
  const { state: layout, dispatch: layoutDispatch } = useContext(LayoutContext);
  const me = useContext(MeContext);

  const avatarText = useMemo<string>(() => {
    const first = me.state.user.data?.firstName?.[0] || "";
    const last = me.state.user.data?.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  }, [me.state.user.data]);

  const toggleSidebar = useCallback(() => {
    layoutDispatch({
      type: "SET_SIDEBAR_IS_OPEN",
      payload: !layout.sidebar.isOpen,
    });
  }, [layoutDispatch, layout.sidebar.isOpen]);

  const logout = useCallback(async () => {
    message.loading({
      key: "header-message",
      content: "Əməliyyat aparılır...",
    });
    await MeService.logout();
    me.dispatch({ type: "SET_USER", payload: null });
    message.destroy("header-message");
  }, [me]);

  return {
    sidebarIsOpen: layout.sidebar.isOpen,
    toggleSidebar,
    avatarText,
    logout,
    userName:
      `${me.state.user.data?.firstName || ""} ${me.state.user.data?.lastName || ""}`.trim(),
  };
};
