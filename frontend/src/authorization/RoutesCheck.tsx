import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useApiCall from "../hooks/useApiCall";
import { getCurrentUserAPI } from "../utility/apiService";
import { GlobalContextType, UserInfo } from "../constants";
import { GlobalContext } from "../contexts/GlobalContext";

const RoutesCheck: React.FC<{
  route: "private" | "public";
}> = ({ route }) => {
  const { dispatch }: GlobalContextType = useContext(GlobalContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    fetchData: getCurrentUser,
    loading,
    data: user,
  } = useApiCall<UserInfo>(getCurrentUserAPI);

  useEffect(() => {
    const checkAuth = async () => {
      const resp = await getCurrentUser(undefined);

      if (resp.data) {
        setIsAuthenticated(true);
        dispatch({
          type: "SET_USER_INFO",
          payload: resp.data as UserInfo,
        });
      } else setIsAuthenticated(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    dispatch({
      type: "SET_LOADING",
      payload: loading,
    });
  }, [dispatch, loading]);

  if (route === "private") {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  } else return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default RoutesCheck;
