import React, { createContext, useState, useEffect } from 'react';
import type { IUser, LoginDTO, RegisterDTO, AuthResult, ApiResponse } from '../types/auth';
import { api } from '../lib/axios';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const handleAuthSuccess = (result: AuthResult) => {
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
  };

  const login = async (data: LoginDTO): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post<ApiResponse<AuthResult>>('/auth/login', data);
      if (response.data.success && response.data.data) {
        handleAuthSuccess(response.data.data);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterDTO): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post<ApiResponse<AuthResult>>('/auth/register', data);
      if (response.data.success && response.data.data) {
        handleAuthSuccess(response.data.data);
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
