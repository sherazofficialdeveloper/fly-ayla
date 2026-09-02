import { apiClient } from '../api/client';

export class ProfileService {
  static async getProfile() {
    return apiClient('/api/users/me');
  }

  static async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    companyName?: string;
    profileImage?: string;
  }) {
    return apiClient('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}
