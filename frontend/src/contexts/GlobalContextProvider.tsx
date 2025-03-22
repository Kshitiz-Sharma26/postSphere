import { useReducer } from "react";
import { Action, initialGlobalState, State } from "../constants";
import { GlobalContext } from "./GlobalContext";

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: action.payload,
      };
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
}

const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialGlobalState);

  return (
    <>
      <GlobalContext.Provider value={{ state, dispatch }}>
        {children}
      </GlobalContext.Provider>
    </>
  );
};

export default GlobalContextProvider;
