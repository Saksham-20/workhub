import axios from 'axios';

// Force production backend URL for deployed frontend
const API_URL = 'https://workhub-jj2l.onrender.com';

// Debug logging
console.log('🔍 API Configuration:');
console.log('   REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   Final API_URL:', API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;