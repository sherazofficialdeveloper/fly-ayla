import { apiClient } from '../api/client';

export class QuoteService {
  static async getMyQuotes() {
    return apiClient('/api/quotes/my');
  }

  static async getQuoteById(id: string) {
    return apiClient(`/api/quotes/${id}`);
  }

  static async approveQuote(id: string) {
    return apiClient(`/api/quotes/${id}/approve`, {
      method: 'PATCH',
    });
  }

  static async rejectQuote(id: string) {
    return apiClient(`/api/quotes/${id}/reject`, {
      method: 'PATCH',
    });
  }
}
