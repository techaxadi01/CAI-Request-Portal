import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { evaluateEmailDomain } from '../utils/emailValidator';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cai_token') || '');
  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch demo users for the quick switch bar
    api.getDemoUsers().then((res) => {
      if (res && res.success) {
        setDemoUsers(res.users);
      }
    });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const res = await api.login(email, password);
    setLoading(false);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('cai_user', JSON.stringify(res.user));
      localStorage.setItem('cai_token', res.token);
      return { success: true, user: res.user, warning: res.emailWarning };
    }
    return { success: false, message: res.message };
  };

  const register = async (userData) => {
    setLoading(true);
    const res = await api.register(userData);
    setLoading(false);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('cai_user', JSON.stringify(res.user));
      localStorage.setItem('cai_token', res.token);
      return { success: true, user: res.user, warning: res.emailWarning };
    }
    return { success: false, message: res.message };
  };

  const switchDemoUser = async (email) => {
    // Find in demoUsers or login with default demo password
    return login(email, 'password123');
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('cai_user');
    localStorage.removeItem('cai_token');
  };

  const emailInfo = user ? evaluateEmailDomain(user.email) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        demoUsers,
        emailInfo,
        login,
        register,
        switchDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
