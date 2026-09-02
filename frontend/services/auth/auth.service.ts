import { apiClient, setAccessToken } from '../api/client';
import { User, AuthResponse, RegisterPayload, LoginPayload, UpdateProfilePayload } from '../../types/auth';

export class AuthService {
  static async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient<{ user: User; accessToken: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    });

    if (res.success && res.data?.accessToken) {
      setAccessToken(res.data.accessToken);
    }

    return res;
  }

  static async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient<{ user: User; accessToken: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    });

    if (res.success && res.data?.accessToken) {
      setAccessToken(res.data.accessToken);
    }

    return res;
  }

  static async logout(): Promise<boolean> {
    try {
      await apiClient('/api/auth/logout', {
        method: 'POST',
      });
    } finally {
      setAccessToken(null);
    }
    return true;
  }

  static async getMe(): Promise<{ success: boolean; data?: { user: User }; message?: string }> {
    return apiClient<{ user: User }>('/api/auth/me', {
      method: 'GET',
    });
  }

  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
    return {
      success: res.success,
      message: res.message || 'Password reset instructions have been dispatched.',
    };
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
      skipAuth: true,
    });
    return {
      success: res.success,
      message: res.message || 'Password reset complete.',
    };
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return {
      success: res.success,
      message: res.message || 'Password successfully updated.',
    };
  }

  static async updateProfile(payload: UpdateProfilePayload): Promise<{ success: boolean; data?: { user: User }; message?: string }> {
    return apiClient<{ user: User }>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  static async getAdminCustomers(): Promise<{ success: boolean; data?: { customers: User[]; total: number }; message?: string }> {
    return apiClient<{ customers: User[]; total: number }>('/api/admin/customers', {
      method: 'GET',
    });
  }

  static async updateCustomerStatus(
    id: string,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<{ success: boolean; data?: { customer: User }; message?: string }> {
    return apiClient<{ customer: User }>(`/api/admin/customers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}
