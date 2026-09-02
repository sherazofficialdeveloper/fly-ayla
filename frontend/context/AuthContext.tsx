'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, RegisterPayload, LoginPayload, UpdateProfilePayload } from '../types/auth';
import { AuthService } from '../services/auth/auth.service';
import { getAccessToken, setAccessToken } from '../services/api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: 'guest' | 'customer' | 'admin';
  isLoading: boolean;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message?: string; role?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Initialize session on boot
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const token = getAccessToken();
      if (!token) {
        if (mounted) {
          setUser(null);
          setIsInitializing(false);
        }
        return;
      }

      try {
        const res = await AuthService.getMe();
        if (mounted) {
          if (res.success && res.data?.user) {
            setUser(res.data.user);
          } else {
            setUser(null);
            setAccessToken(null);
          }
        }
      } catch (err) {
        if (mounted) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await AuthService.login(payload);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true, message: res.message, role: res.data.user.role };
      }
      return { success: false, message: res.message || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await AuthService.register(payload);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await AuthService.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    setIsLoading(true);
    try {
      const res = await AuthService.updateProfile(payload);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Profile update failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Profile update failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const res = await AuthService.changePassword(currentPassword, newPassword);
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to change password' };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      return await AuthService.forgotPassword(email);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      return await AuthService.resetPassword(token, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const role = user ? user.role : 'guest';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        role,
        isLoading,
        isInitializing,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  role: 'guest',
  isLoading: false,
  isInitializing: false,
  login: async () => ({ success: false, message: 'Not initialized' }),
  register: async () => ({ success: false, message: 'Not initialized' }),
  logout: async () => {},
  refreshUser: async () => {},
  updateProfile: async () => ({ success: false, message: 'Not initialized' }),
  changePassword: async () => ({ success: false, message: 'Not initialized' }),
  forgotPassword: async () => ({ success: false, message: 'Not initialized' }),
  resetPassword: async () => ({ success: false, message: 'Not initialized' }),
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    return defaultAuthContext;
  }
  return context;
};
