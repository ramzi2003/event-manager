import axios from "axios";

const API_URL = "http://10.121.4.116:8000/";

const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_URL}auth/jwt/create/`,
      credentials
    );
    if (response.data.access && response.data.refresh) {
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
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
};

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("getCurrentUser user:", user);
  return user;
};

const fetchUserInfo = async (accessToken) => {
  try {
    const response = await axios.get(`${API_URL}accounts/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const isAdmin = response.data.is_admin;
    localStorage.setItem("user", JSON.stringify({ is_admin: isAdmin }));
    return { is_admin: isAdmin };
  } catch (error) {
    console.error("Fetch user info failed:", error);
    throw error;
  }
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${API_URL}auth/jwt/refresh/`, {
      refresh: refreshToken,
    });
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
    }
    return response.data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
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