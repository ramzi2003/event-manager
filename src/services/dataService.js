import axios from 'axios';

const API_URL = 'http://10.121.4.116:8000/';

const fetchDepartments = async () => {
  try {
    const token = localStorage.getItem('accessToken'); 
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${API_URL}api/departments/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

const fetchEvents = async () => {
  try {
    const token = localStorage.getItem('accessToken'); 
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${API_URL}api/events/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

const fetchTasks = async () => {
  try {
    const token = localStorage.getItem('accessToken'); 
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${API_URL}api/tasks/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

const updateTaskStatus = async (taskId, status) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
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
    console.error('Error updating task status:', error);
    throw error;
  }
};

const deleteEvent = async (eventId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }
    await axios.delete(`${API_URL}api/events/${eventId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

const fetchVenues = async () => {
  try {
    const token = localStorage.getItem('accessToken'); 
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${API_URL}api/venues/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

const dataService = {
  fetchDepartments,
  fetchEvents,
  fetchTasks,
  updateTaskStatus,
  deleteEvent,
  fetchVenues
};

export default dataService;