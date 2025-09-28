import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base configuration
const api = axios.create({
   baseURL: 'http:// 192.168.0.104:5171/api', // Update this to your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // You might want to redirect to login screen here
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  // Login user
  login: (credentials) => api.post('/Auth/login', credentials),
  
  // Register new user
  register: (userData) => api.post('/Auth/register', userData),
  
  // Google login - Sends the access token to the backend
  googleLogin: (data) => api.post('/Auth/google-login', data),
  
  // Forgot password
  forgotPassword: (email) => api.post('/Auth/forgot-password', email),
  
  // Reset password
  resetPassword: (data) => api.post('/Auth/reset-password', data),
};

// Habit API methods

export const habitAPI = {
  // Get current user's habits
  getMyHabits: (userId) => api.get(`/habits/user/${userId}`),
  
  // Get single habit
  getHabit: (id) => api.get(`/habits/${id}`),
  
  // Create new habit
  createHabit: (habit) => api.post('/habits', habit),
  
  // Update habit
  updateHabit: (id, habit) => api.put(`/habits/${id}`, habit),
  
  // Delete habit
  deleteHabit: (id) => api.delete(`/habits/${id}`),
  
  // Log habit completion
  logHabit: (habitId, logData) => api.post(`/habits/${habitId}/log`, logData),
  
  // Get habit analytics
  getHabitAnalytics: (habitId, startDate, endDate) => 
    api.get(`/habits/${habitId}/analytics`, {
      params: { startDate, endDate }
    }),
};

export default api;