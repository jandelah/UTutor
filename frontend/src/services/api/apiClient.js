// src/services/api/apiClient.js

import axios from 'axios';

// Set the API URL directly rather than relying on environment variables
const API_URL = 'https://ututor-api.onrender.com';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to handle potential slow cold starts on Render free tier
  timeout: 15000
});

// Request interceptor with improved error handling
apiClient.interceptors.request.use(
  (config) => {
    // Add token for authentication if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return just the data portion for convenience
  },
  (error) => {
    // Create a user-friendly error message
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with an error status code
      console.error(
        `API Error ${error.response.status}:`, 
        error.response.data.message || error.response.statusText
      );
      
      errorMessage = error.response.data.message || 
                     `Server error: ${error.response.status}`;
                     
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('token');
          // Could add redirect logic here
          errorMessage = 'Your session has expired. Please log in again.';
          break;
        case 404:
          errorMessage = `The requested resource was not found: ${error.config.url}`;
          break;
        case 422:
          errorMessage = 'Validation failed. Please check your input.';
          break;
      }
    } else if (error.request) {
      // Request was made but no response received (network issue)
      console.error('Network Error: No response received', error.request);
      errorMessage = 'Unable to connect to server. Please check your internet connection.';
      
      // Check if this might be a cold start delay on Render free tier
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Server is taking too long to respond. It might be starting up after inactivity.';
      }
    } else {
      // Something else caused the error
      console.error('API Client Error:', error.message);
    }
    
    // Create a new error with the friendly message
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.response = error.response;
    
    return Promise.reject(enhancedError);
  }
);

export default apiClient;