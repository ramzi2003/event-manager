import axios from "axios";

const API_URL = "http://10.121.4.116:8000/";

const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_URL}auth/jwt/create/`,
      credentials
    );
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrectUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    login,
    logout,
    getCurrectUser
};

export default authService;


