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
  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error logging in');
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      // Combine firstName and lastName into a single name field
      const apiData = {
        email: userData.email,
        password: userData.password,
        // Create a full name from firstName and lastName
        name: `${userData.firstName} ${userData.lastName}`,
        career: userData.career,
        semester: userData.semester,
        role: userData.role,
        // Include any additional fields needed by the backend
      };
      
      // Log what we're sending to help debug
      console.log('Sending registration data:', apiData);
      
      const response = await apiClient.post('/users/register', apiData);
      
      // Store token if it exists in the response
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Set current user
      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
      }
      
      return response.data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Error registering');
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