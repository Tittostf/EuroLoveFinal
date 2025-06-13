import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        ApiService.setToken(token);
        try {
          const profile = await ApiService.getProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to get profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials);
      const { token: newToken, user: userData } = response;
      
      setToken(newToken);
      setUser(userData);
      ApiService.setToken(newToken);
      localStorage.setItem('auth_token', newToken);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await ApiService.register(userData);
      const { token: newToken, user: userInfo } = response;
      
      setToken(newToken);
      setUser(userInfo);
      ApiService.setToken(newToken);
      localStorage.setItem('auth_token', newToken);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    ApiService.setToken(null);
    localStorage.removeItem('auth_token');
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isClient: user?.user_type === 'client',
    isEscort: user?.user_type === 'escort',
    isAdmin: user?.user_type === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;