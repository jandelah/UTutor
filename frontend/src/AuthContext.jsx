import { createContext, useState, useContext, useEffect } from 'react';
import { MOCK_USERS } from './services/mockData';

// Create context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  
  // Login function
  const login = (email, password) => {
    // In a real app, this would make an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(user => user.email === email);
        
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 500);
    });
  };
  
  // Register function
  const register = (userData) => {
    // In a real app, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create new user with ID based on array length
        const newUser = {
          id: MOCK_USERS.length + 1,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          avatar: `https://i.pravatar.cc/150?img=${MOCK_USERS.length + 10}`,
          career: userData.career,
          semester: parseInt(userData.semester),
          role: userData.role
        };
        
        // Add user to mock data (in a real app this would be handled by backend)
        MOCK_USERS.push(newUser);
        
        // Set as current user
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        resolve(newUser);
      }, 500);
    });
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
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
