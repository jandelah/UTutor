// src/services/api/apiClient.js

import axios from 'axios';

// Get the API URL from environment or use fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://ututor-api.onrender.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token and handle logging
apiClient.interceptors.request.use(
  (config) => {
    // Log the request in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    // Get token from localStorage and add to headers if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and parse data
apiClient.interceptors.response.use(
  (response) => {
    // Log the response in development
    if (import.meta.env.DEV) {
      console.log(`API Response (${response.status}):`, response.data);
    }
    
    // Transform response based on structure to ensure consistency
    // This helps handle various API response formats
    if (response.data && (response.data.success !== undefined)) {
      // API follows {success: true, data: ...} pattern
      if (!response.data.success) {
        // API indicates failure - convert to error for consistent handling
        return Promise.reject({
          response: {
            status: response.status,
            data: response.data
          }
        });
      }
    }
    
    return response;
  },
  async (error) => {
    // Handle different error scenarios
    if (error.response) {
      // The request was made and the server responded with an error code
      const status = error.response.status;
      const errorData = error.response.data;

      if (import.meta.env.DEV) {
        console.error(`API Error ${status}:`, errorData);
      }
      
      // Handle unauthorized errors (401)
      if (status === 401) {
        // Clear token as it's invalid
        localStorage.removeItem('token');
        
        // Redirect to login (when not already on login page)
        if (window.location.pathname !== '/login') {
          // Store the current location to redirect back after login
          localStorage.setItem('redirectAfterLogin', window.location.pathname);
          window.location.href = '/UTutor';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received (network error)
      console.error('Network Error:', error.request);
      
      // For better UX, we could add offline detection/handling here
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;