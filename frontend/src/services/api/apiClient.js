// src/services/api/apiClient.js

import axios from 'axios';

const API_URL = 'https://ututor-api.onrender.com';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Don't transform the response - we'll handle it manually in our code
  transformResponse: [(data) => {
    // Keep the original response data
    return data;
  }]
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    // Log the request in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Process responses
apiClient.interceptors.response.use(
  (response) => {
    // For successful responses, parse JSON if it's a string
    if (typeof response.data === 'string' && response.data.trim()) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        console.warn('Failed to parse response as JSON:', e);
      }
    }
    
    // Log the response in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Response: ${response.status}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // For errors, add more context and better logging
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error (no response):', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;