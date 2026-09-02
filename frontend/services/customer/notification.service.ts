import { apiClient } from '../api/client';

export class NotificationService {
  static async getNotifications() {
    return apiClient('/api/notifications');
  }

  static async markAsRead(id: string) {
    return apiClient(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  static async markAllAsRead() {
    return apiClient('/api/notifications/read-all', {
      method: 'PATCH',
    });
  }
}
