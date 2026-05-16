import { useCallback, useContext } from "react";
import { LayoutContext } from "../../context";

export const useSidebar = () => {
  const { state, dispatch } = useContext(LayoutContext);
  const location = window.location.pathname;

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "SET_SIDEBAR_IS_OPEN", payload: !state.sidebar.isOpen });
  }, [dispatch, state.sidebar.isOpen]);

  return {
    isOpen: state.sidebar.isOpen,
    activeKey: location,
    toggleSidebar,
  };
};
