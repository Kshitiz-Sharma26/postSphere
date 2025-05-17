export type UserInfo = { username: string; profileImage: string; id: string };

export type SetUserInfoAction = {
  type: "SET_USER_INFO";
  payload: UserInfo;
};

export type SetIsLoadingAction = {
  type: "SET_LOADING";
  payload: boolean;
};

export type SetThemeAction = {
  type: "SET_THEME";
  payload: "dark" | "light";
};

export type Action = SetUserInfoAction | SetIsLoadingAction | SetThemeAction;

export type State = {
  isLoading: boolean;
  userInfo?: UserInfo;
  theme: "dark" | "light";
};

export const initialGlobalState: State = {
  userInfo: undefined,
  isLoading: false,
  theme: "light",
};

export type GlobalContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};
