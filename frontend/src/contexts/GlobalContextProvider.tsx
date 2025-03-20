import { useReducer } from "react";
import GlobalContext from "./GlobalContext";

type Action = {
  type: string;
  payload: any;
};
type State = {
  isLoading: boolean;
  [key: string]: any;
};
const initialState: State = {
  userInfo: {},
  isLoading: false,
};

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
    default:
      return state;
  }
}

const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <GlobalContext.Provider value={{ state, dispatch }}>
        {children}
      </GlobalContext.Provider>
    </>
  );
};

export default GlobalContextProvider;
