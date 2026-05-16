import React from "react";
import { ILayoutContext } from "./types";
import { initialLayoutState } from "./state";

export const LayoutContext = React.createContext<ILayoutContext>({
  state: initialLayoutState,
  dispatch: () => undefined,
});
