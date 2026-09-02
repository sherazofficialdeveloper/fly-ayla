import { apiClient } from '../api/client';

export class BookingService {
  static async getMyBookings() {
    return apiClient('/api/bookings/my');
  }

  static async getBookingById(id: string) {
    return apiClient(`/api/bookings/${id}`);
  }
}
