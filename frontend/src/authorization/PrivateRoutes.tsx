import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useApiCall from "../hooks/useApiCall";
import { getCurrentUserAPI } from "../utility/apiService";
import { GlobalContextType, UserInfo } from "../constants";
import { GlobalContext } from "../contexts/GlobalContext";

const PrivateRoutes = () => {
  const { dispatch }: GlobalContextType = useContext(GlobalContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    fetchData: getCurrentUser,
    loading,
    data: user,
  } = useApiCall<UserInfo>(getCurrentUserAPI);

  useEffect(() => {
    const checkAuth = async () => {
      await getCurrentUser();

      if (user) {
        setIsAuthenticated(true);
        dispatch({
          type: "SET_USER_INFO",
          payload: user,
        });
      } else setIsAuthenticated(false);
    };

    checkAuth();
  }, [dispatch, getCurrentUser, user]);

  useEffect(() => {
    dispatch({
      type: "SET_LOADING",
      payload: loading,
    });
  }, [dispatch, loading]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
