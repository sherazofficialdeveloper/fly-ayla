import { apiClient } from '../api/client';

export class AdminService {
  // Dashboard
  static async getDashboard() {
    return apiClient('/api/admin/dashboard');
  }

  static async getDashboardMetrics() {
    return this.getDashboard();
  }

  // Customers
  static async getCustomers(
    paramsOrPage?: number | { page?: number; limit?: number; search?: string; status?: string },
    limit = 20,
    search = '',
    status = ''
  ) {
    let p = 1;
    let l = limit;
    let s = search;
    let st = status;

    if (typeof paramsOrPage === 'object' && paramsOrPage !== null) {
      p = paramsOrPage.page ?? 1;
      l = paramsOrPage.limit ?? 20;
      s = paramsOrPage.search ?? '';
      st = paramsOrPage.status ?? '';
    } else if (typeof paramsOrPage === 'number') {
      p = paramsOrPage;
    }

    const query = new URLSearchParams({ page: String(p), limit: String(l) });
    if (s) query.append('search', s);
    if (st) query.append('status', st);
    return apiClient(`/api/admin/customers?${query.toString()}`);
  }

  static async getCustomerDetails(id: string) {
    return apiClient(`/api/admin/customers/${id}`);
  }

  static async updateCustomerStatus(id: string, status: 'active' | 'inactive' | 'suspended') {
    return apiClient(`/api/admin/customers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Flight Requests
  static async getFlightRequests(
    paramsOrPage?: number | { page?: number; limit?: number; search?: string; status?: string },
    limit = 20,
    search = '',
    status = ''
  ) {
    let p = 1;
    let l = limit;
    let s = search;
    let st = status;

    if (typeof paramsOrPage === 'object' && paramsOrPage !== null) {
      p = paramsOrPage.page ?? 1;
      l = paramsOrPage.limit ?? 20;
      s = paramsOrPage.search ?? '';
      st = paramsOrPage.status ?? '';
    } else if (typeof paramsOrPage === 'number') {
      p = paramsOrPage;
    }

    const query = new URLSearchParams({ page: String(p), limit: String(l) });
    if (s) query.append('search', s);
    if (st) query.append('status', st);
    return apiClient(`/api/admin/flight-requests?${query.toString()}`);
  }

  static async getFlightRequestDetails(id: string) {
    return apiClient(`/api/admin/flight-requests/${id}`);
  }

  static async createFlightRequest(data: any) {
    return apiClient('/api/admin/flight-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateFlightRequest(id: string, data: any) {
    return apiClient(`/api/admin/flight-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async updateFlightRequestStatus(id: string, status: string) {
    return this.updateFlightRequest(id, { status });
  }

  // Quotes
  static async getQuotes(
    paramsOrPage?: number | { page?: number; limit?: number; search?: string; status?: string },
    limit = 20,
    search = '',
    status = ''
  ) {
    let p = 1;
    let l = limit;
    let s = search;
    let st = status;

    if (typeof paramsOrPage === 'object' && paramsOrPage !== null) {
      p = paramsOrPage.page ?? 1;
      l = paramsOrPage.limit ?? 20;
      s = paramsOrPage.search ?? '';
      st = paramsOrPage.status ?? '';
    } else if (typeof paramsOrPage === 'number') {
      p = paramsOrPage;
    }

    const query = new URLSearchParams({ page: String(p), limit: String(l) });
    if (s) query.append('search', s);
    if (st) query.append('status', st);
    return apiClient(`/api/admin/quotes?${query.toString()}`);
  }

  static async getQuoteDetails(id: string) {
    return apiClient(`/api/admin/quotes/${id}`);
  }

  static async createQuote(data: any) {
    return apiClient('/api/admin/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateQuote(id: string, data: any) {
    return apiClient(`/api/admin/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async updateQuoteStatus(id: string, status: string) {
    return apiClient(`/api/admin/quotes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Bookings
  static async getBookings(
    paramsOrPage?: number | { page?: number; limit?: number; search?: string; status?: string },
    limit = 20,
    search = '',
    status = ''
  ) {
    let p = 1;
    let l = limit;
    let s = search;
    let st = status;

    if (typeof paramsOrPage === 'object' && paramsOrPage !== null) {
      p = paramsOrPage.page ?? 1;
      l = paramsOrPage.limit ?? 20;
      s = paramsOrPage.search ?? '';
      st = paramsOrPage.status ?? '';
    } else if (typeof paramsOrPage === 'number') {
      p = paramsOrPage;
    }

    const query = new URLSearchParams({ page: String(p), limit: String(l) });
    if (s) query.append('search', s);
    if (st) query.append('status', st);
    return apiClient(`/api/admin/bookings?${query.toString()}`);
  }

  static async getBookingDetails(id: string) {
    return apiClient(`/api/admin/bookings/${id}`);
  }

  static async createBooking(data: any) {
    return apiClient('/api/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateBooking(id: string, data: any) {
    return apiClient(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async updateBookingStatus(id: string, data: any) {
    return this.updateBooking(id, data);
  }

  // Invoices
  static async getInvoices(
    paramsOrPage?: number | { page?: number; limit?: number; search?: string; status?: string },
    limit = 20,
    search = '',
    status = ''
  ) {
    let p = 1;
    let l = limit;
    let s = search;
    let st = status;

    if (typeof paramsOrPage === 'object' && paramsOrPage !== null) {
      p = paramsOrPage.page ?? 1;
      l = paramsOrPage.limit ?? 20;
      s = paramsOrPage.search ?? '';
      st = paramsOrPage.status ?? '';
    } else if (typeof paramsOrPage === 'number') {
      p = paramsOrPage;
    }

    const query = new URLSearchParams({ page: String(p), limit: String(l) });
    if (s) query.append('search', s);
    if (st) query.append('status', st);
    return apiClient(`/api/admin/invoices?${query.toString()}`);
  }

  static async getInvoiceDetails(id: string) {
    return apiClient(`/api/admin/invoices/${id}`);
  }

  static async createInvoice(data: any) {
    return apiClient('/api/admin/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateInvoice(id: string, data: any) {
    return apiClient(`/api/admin/invoices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async updateInvoiceStatus(id: string, data: any) {
    return this.updateInvoice(id, data);
  }

  // Payments
  static async getPayments(
    paramsOrPage?: number | { page?: number; limit?: number; search?: string; status?: string },
    limit = 20,
    search = '',
    status = ''
  ) {
    let p = 1;
    let l = limit;
    let s = search;
    let st = status;

    if (typeof paramsOrPage === 'object' && paramsOrPage !== null) {
      p = paramsOrPage.page ?? 1;
      l = paramsOrPage.limit ?? 20;
      s = paramsOrPage.search ?? '';
      st = paramsOrPage.status ?? '';
    } else if (typeof paramsOrPage === 'number') {
      p = paramsOrPage;
    }

    const query = new URLSearchParams({ page: String(p), limit: String(l) });
    if (s) query.append('search', s);
    if (st) query.append('status', st);
    return apiClient(`/api/admin/payments?${query.toString()}`);
  }

  static async getPaymentDetails(id: string) {
    return apiClient(`/api/admin/payments/${id}`);
  }

  static async createPayment(data: any) {
    return apiClient('/api/admin/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Aircraft
  static async getAircraft() {
    return apiClient('/api/admin/aircraft');
  }

  static async createAircraft(data: any) {
    return apiClient('/api/admin/aircraft', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateAircraft(id: string, data: any) {
    return apiClient(`/api/admin/aircraft/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteAircraft(id: string) {
    return apiClient(`/api/admin/aircraft/${id}`, {
      method: 'DELETE',
    });
  }

  // Airports
  static async getAirports(paramsOrSearch?: string | { search?: string; status?: string }, status = '') {
    let s = '';
    let st = status;

    if (typeof paramsOrSearch === 'object' && paramsOrSearch !== null) {
      s = paramsOrSearch.search ?? '';
      st = paramsOrSearch.status ?? '';
    } else if (typeof paramsOrSearch === 'string') {
      s = paramsOrSearch;
    }

    const query = new URLSearchParams();
    if (s) query.append('search', s);
    if (st) query.append('status', st);
    return apiClient(`/api/admin/airports?${query.toString()}`);
  }

  static async createAirport(data: any) {
    return apiClient('/api/admin/airports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateAirport(id: string, data: any) {
    return apiClient(`/api/admin/airports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteAirport(id: string) {
    return apiClient(`/api/admin/airports/${id}`, {
      method: 'DELETE',
    });
  }

  // Pricing Engine
  static async getPricingRules() {
    return apiClient('/api/admin/pricing');
  }

  static async updatePricingRules(data: any) {
    return apiClient('/api/admin/pricing', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PAYLA FORENSIC
  static async getForensicCases() {
    return apiClient('/api/admin/payla-forensic');
  }

  static async updateForensicCase(id: string, data: any) {
    return apiClient(`/api/admin/payla-forensic/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  static async getNotifications() {
    return apiClient('/api/admin/notifications');
  }

  static async markNotificationRead(id: string) {
    return apiClient(`/api/admin/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  static async markAllNotificationsRead() {
    return apiClient('/api/admin/notifications/mark-all-read', {
      method: 'POST',
    });
  }

  // Reports
  static async getReports() {
    return apiClient('/api/admin/reports');
  }

  static async getFinancialReports() {
    return this.getReports();
  }

  // Audit Logs
  static async getAuditLogs(
    paramsOrPage?: number | { page?: number; limit?: number; category?: string; search?: string },
    limit = 50,
    category = '',
    search = ''
  ) {
    let p = 1;
    let l = limit;
    let c = category;
    let s = search;

    if (typeof paramsOrPage === 'object' && paramsOrPage !== null) {
      p = paramsOrPage.page ?? 1;
      l = paramsOrPage.limit ?? 50;
      c = paramsOrPage.category ?? '';
      s = paramsOrPage.search ?? '';
    } else if (typeof paramsOrPage === 'number') {
      p = paramsOrPage;
    }

    const query = new URLSearchParams({ page: String(p), limit: String(l) });
    if (c) query.append('category', c);
    if (s) query.append('search', s);
    return apiClient(`/api/admin/audit-logs?${query.toString()}`);
  }

  // Settings
  static async getSettings() {
    return apiClient('/api/admin/settings');
  }

  static async updateSettings(data: any) {
    return apiClient('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Profile
  static async getProfile() {
    return apiClient('/api/admin/profile');
  }

  static async updateProfile(data: any) {
    return apiClient('/api/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    return apiClient('/api/admin/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}
