import axios from "axios";

const API_URL = "http://10.121.4.116:8000/";

const getToken = () => {
  return (
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );
};

const fetchDepartments = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get(`${API_URL}api/departments/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

const fetchUsers = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get(`${API_URL}accounts/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const fetchUserTypes = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get(`${API_URL}accounts/user-type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user types:", error);
    throw error;
  }
};

const fetchEvents = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get(`${API_URL}api/events/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const fetchEventById = async (eventId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.get(`${API_URL}api/events/${eventId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
};

const fetchTaskById = async (taskId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.get(`${API_URL}api/tasks/${taskId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

const fetchUserById = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.get(`${API_URL}accounts/users/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

const fetchTasks = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get(`${API_URL}api/tasks/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

const updateTaskStatus = async (taskId, status) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.patch(
      `${API_URL}api/tasks/${taskId}/`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

const deleteEvent = async (eventId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    await axios.delete(`${API_URL}api/events/${eventId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    await axios.delete(`${API_URL}accounts/users/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

const deleteTask = async (taskId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    await axios.delete(`${API_URL}api/tasks/${taskId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

const fetchVenues = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get(`${API_URL}api/venues/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
};

const createEvent = async (eventData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.post(`${API_URL}api/events/`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const resetPasswordEmailLetter = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}accounts/password/reset/`,
      email
    );
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const resetPassword = async (resetData) => {
  try {
    const response = await axios.post(
      `${API_URL}auth/users/reset_password_confirm/
`,
      resetData
    );
    return response.data;
  } catch (error) {
    console.error("Error reseting password:", error);
    console.log(resetData)
    throw error;
  }
};

const createTask = async (taskData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.post(`${API_URL}api/tasks/`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.post(
      `${API_URL}accounts/register/`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateEvent = async (eventId, eventData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.put(
      `${API_URL}api/events/${eventId}/`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.put(
      `${API_URL}accounts/users/${userId}/`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const updateTask = async (taskId, taskData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await axios.put(
      `${API_URL}api/tasks/${taskId}/`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

const dataService = {
  fetchDepartments,
  fetchEvents,
  fetchEventById,
  fetchTasks,
  updateTaskStatus,
  deleteEvent,
  fetchVenues,
  createEvent,
  updateEvent,
  deleteTask,
  createTask,
  fetchTaskById,
  updateTask,
  fetchUserTypes,
  fetchUsers,
  createUser,
  updateUser,
  fetchUserById,
  deleteUser,
  resetPasswordEmailLetter,
  resetPassword,
};

export default dataService;
