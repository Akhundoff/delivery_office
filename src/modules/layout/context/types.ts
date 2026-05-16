export interface ILayoutState {
  sidebar: {
    isOpen: boolean;
  };
}

export type LayoutAction = { type: "SET_SIDEBAR_IS_OPEN"; payload: boolean };

export interface ILayoutContext {
  state: ILayoutState;
  dispatch: React.Dispatch<LayoutAction>;
}
