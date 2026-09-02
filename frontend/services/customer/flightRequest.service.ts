import { apiClient } from '../api/client';

export class FlightRequestService {
  static async submitRequest(data: any) {
    return apiClient('/api/flight-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getMyRequests() {
    return apiClient('/api/flight-requests/my');
  }

  static async getRequestById(id: string) {
    return apiClient(`/api/flight-requests/${id}`);
  }
}
