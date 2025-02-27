import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { refreshToken } from "../store/authSlice";
import authService from "../services/authService";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }

      try {
        await authService.fetchUserInfo(accessToken);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            await dispatch(refreshToken());
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            window.location.href = "/login";
          }
        } else {
          window.location.href = "/login";
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
