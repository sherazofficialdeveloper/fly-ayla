import { apiClient } from '../api/client';

export class InvoiceService {
  static async getMyInvoices() {
    return apiClient('/api/invoices/my');
  }

  static async getInvoiceById(id: string) {
    return apiClient(`/api/invoices/${id}`);
  }
}
