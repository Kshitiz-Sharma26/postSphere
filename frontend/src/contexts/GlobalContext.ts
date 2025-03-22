import { createContext } from "react";
import { GlobalContextType, initialGlobalState } from "../constants";

export const GlobalContext = createContext<GlobalContextType>({
  state: initialGlobalState,
  dispatch: () => {},
});
