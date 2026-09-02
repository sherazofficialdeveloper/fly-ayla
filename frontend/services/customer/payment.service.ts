import { apiClient } from '../api/client';

export class PaymentService {
  static async getMyPayments() {
    return apiClient('/api/payments/my');
  }

  static async getPaymentById(id: string) {
    return apiClient(`/api/payments/${id}`);
  }

  static async getInvoicePaymentStatus(invoiceId: string) {
    return apiClient(`/api/payments/invoice/${invoiceId}/status`);
  }

  static async createCheckoutSession(invoiceId: string, paymentMethod?: string) {
    return apiClient('/api/payments/checkout-session', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, paymentMethod }),
    });
  }
}

