import axios from "axios";

const API_URL = "http://10.121.4.116:8000/";

const login = async ({ username, password, rememberMe }) => {
  try {
    const response = await axios.post(
      `${API_URL}auth/jwt/create/`,
      { username, password }
    );
    if (response.data.access && response.data.refresh) {
      if (rememberMe) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        sessionStorage.setItem("accessToken", response.data.access);
        sessionStorage.setItem("refreshToken", response.data.refresh);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  return user;
};

const fetchUserInfo = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const response = await axios.get(`${API_URL}accounts/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { is_admin, department, username, email, first_name, last_name, user_type, id } = response.data;
    const userInfo = { is_admin, department, username, email, first_name, last_name, user_type, id };
    localStorage.setItem("user", JSON.stringify(userInfo));
    sessionStorage.setItem("user", JSON.stringify(userInfo));
    return userInfo;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token might be expired, try refreshing it
      try {
        const newAccessToken = await refreshToken();
        const response = await axios.get(`${API_URL}accounts/me`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        const { is_admin, department, username, email, first_name, last_name, user_type, id } = response.data;
        const userInfo = { is_admin, department, username, email, first_name, last_name, user_type, id };
        localStorage.setItem("user", JSON.stringify(userInfo));
        sessionStorage.setItem("user", JSON.stringify(userInfo));
        return userInfo;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        logout();
        throw refreshError;
      }
    } else {
      console.error("Fetch user info failed:", error);
      throw error;
    }
  }
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${API_URL}auth/jwt/refresh/`, {
      refresh: refreshToken,
    });
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
      sessionStorage.setItem("accessToken", response.data.access);
      return response.data.access;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    throw error;
  }
};

const authService = {
  login,
  logout,
  getCurrentUser,
  fetchUserInfo,
  refreshToken,
};

export default authService;