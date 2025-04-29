import { createContext, useState, useContext, useEffect } from 'react';
import apiClient from './services/api/apiClient';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for saved user on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);
  
  const fetchUser = async (token) => {
    try {
      const response = await apiClient.get('/users/me');
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };
  
  // Login function
// Login function with redirect support
const login = async (email, password) => {
  try {
    console.log('Attempting login for:', email);
    
    // Make the API call
    const response = await apiClient.post('/users/login', { email, password });
    console.log('Login response:', response);
    
    // Check if the response has the expected structure
    // Using optional chaining and fallbacks for safety
    if (response && response.data) {
      // The response looks good, extract the token and user data
      const token = response.data.token || response.data.access_token;
      const user = response.data.user || response.data.data;
      
      if (!token) {
        console.error('No token found in response:', response.data);
        throw new Error('Authentication failed: No token received');
      }
      
      if (!user) {
        console.error('No user data found in response:', response.data);
        throw new Error('Authentication failed: No user data received');
      }
      
      // Store token in local storage
      localStorage.setItem('token', token);
      
      // Set current user
      setCurrentUser(user);
      
      // Check if there's a redirect path stored
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        // Clear the redirect path
        localStorage.removeItem('redirectAfterLogin');
        
        // Use setTimeout to ensure the auth context has fully updated before redirect
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 100);
      }
      
      return user;
    } else {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    
    // Check if this is a server response error or a client-side error
    if (error.response) {
      // Server responded with an error status code
      console.error('Server error response:', error.response.data);
      throw new Error(error.response.data.message || 'Invalid credentials. Please try again.');
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else caused the error
      throw error;
    }
  }
};
  
  // Register function
  const register = async (userData) => {
    try {
      // Format the data as expected by the backend
      const apiData = {
        email: userData.email,
        password: userData.password,
        name: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}` 
          : userData.name || '',
        career: userData.career,
        semester: userData.semester,
        role: userData.role
      };
      
      console.log('Sending registration data:', apiData);
      
      // Make the API call
      const response = await apiClient.post('/users/register', apiData);
      console.log('Registration response:', response);
      
      // Check if the response has the expected structure
      // Using optional chaining and fallbacks for safety
      let user, token;
      
      if (response && response.data) {
        // Try to get user data from different possible response formats
        user = response.data.user || response.data.data || response.data;
        
        // Try to get token from different possible formats
        token = response.data.token || response.data.access_token;
        
        // Store token if we found one
        if (token) {
          localStorage.setItem('token', token);
        }
        
        // Set current user if we found user data
        if (user) {
          setCurrentUser(user);
        } else {
          console.warn('User data not found in response, using submitted data');
          // Create a fallback user object from the submitted data
          setCurrentUser({
            email: apiData.email,
            name: apiData.name,
            career: apiData.career,
            semester: apiData.semester,
            role: apiData.role
          });
        }
        
        // Return whatever user data we have
        return user || apiData;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Error registering user');
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};