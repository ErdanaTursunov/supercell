import React, { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setCurrentUser(authData.user);
      setToken(authData.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
    }
  }, []);

  const login = (authData) => {
    setCurrentUser(authData.user);
    setToken(authData.token);
    localStorage.setItem('auth', JSON.stringify(authData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('auth');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = useMemo(() => currentUser && token, [currentUser, token]); // Оптимизация через useMemo

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    token,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
