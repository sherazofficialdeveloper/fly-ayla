import { apiClient } from '../api/client';

export class AirportService {
  static async searchAirports(query: string) {
    return apiClient(`/api/airports/search?q=${encodeURIComponent(query)}`);
  }

  static async getAirports() {
    return apiClient('/api/airports');
  }
}
