/**
 * API Configuration & HTTP Client
 * Connects frontend to backend API
 */

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : 'https://api.kasuwadan.com/api'; // Change to your production domain

let authToken = localStorage.getItem('authToken');

const api = {
  setToken: (token) => {
    authToken = token;
    localStorage.setItem('authToken', token);
  },

  getToken: () => authToken,

  clearToken: () => {
    authToken = null;
    localStorage.removeItem('authToken');
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    register: (payload) => api.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload) => api.request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    getMe: () => api.request('/auth/me'),
    updateProfile: (payload) => api.request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  },

  // Products endpoints
  products: {
    getAll: () => api.request('/products'),
    getById: (id) => api.request(`/products/${id}`),
    create: (payload) => api.request('/products', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => api.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => api.request(`/products/${id}`, { method: 'DELETE' }),
  },

  // Customers endpoints
  customers: {
    getAll: () => api.request('/customers'),
    getById: (id) => api.request(`/customers/${id}`),
    create: (payload) => api.request('/customers', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => api.request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => api.request(`/customers/${id}`, { method: 'DELETE' }),
  },

  // Sales endpoints
  sales: {
    getAll: () => api.request('/sales'),
    getById: (id) => api.request(`/sales/${id}`),
    create: (payload) => api.request('/sales', { method: 'POST', body: JSON.stringify(payload) }),
  },

  // Payments endpoints
  payments: {
    getProviders: () => api.request('/payments/providers'),
    checkout: (payload) => api.request('/payments/checkout', { method: 'POST', body: JSON.stringify(payload) }),
    verify: (payload) => api.request('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),
  },

  // Merchant portal endpoints
  merchant: {
    createProfile: (payload) => api.request('/merchant/profile', { method: 'POST', body: JSON.stringify(payload) }),
    getSubscription: () => api.request('/merchant/subscription'),
    getPlans: () => api.request('/merchant/plans'),
    requestUpgrade: (payload) => api.request('/merchant/subscription/upgrade', { method: 'POST', body: JSON.stringify(payload) }),
    getInvoices: () => api.request('/merchant/invoices'),
  },

  // Admin endpoints
  admin: {
    getDashboard: () => api.request('/admin/dashboard'),
    getMerchants: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.request(`/admin/merchants?${query}`);
    },
    getMerchantDetails: (id) => api.request(`/admin/merchants/${id}`),
    verifyMerchantKYC: (id, payload) => api.request(`/admin/merchants/${id}/verify-kyc`, { method: 'PUT', body: JSON.stringify(payload) }),
    suspendMerchant: (id, payload) => api.request(`/admin/merchants/${id}/suspend`, { method: 'PUT', body: JSON.stringify(payload) }),
    banMerchant: (id, payload) => api.request(`/admin/merchants/${id}/ban`, { method: 'PUT', body: JSON.stringify(payload) }),
    getSubscriptions: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.request(`/admin/subscriptions?${query}`);
    },
    changePlan: (id, payload) => api.request(`/admin/subscriptions/${id}/change-plan`, { method: 'PUT', body: JSON.stringify(payload) }),
    cancelSubscription: (id, payload) => api.request(`/admin/subscriptions/${id}/cancel`, { method: 'PUT', body: JSON.stringify(payload) }),
    getPayments: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.request(`/admin/payments?${query}`);
    },
    confirmPayment: (id, payload) => api.request(`/admin/payments/${id}/confirm`, { method: 'PUT', body: JSON.stringify(payload) }),
    refundPayment: (id, payload) => api.request(`/admin/payments/${id}/refund`, { method: 'PUT', body: JSON.stringify(payload) }),
    getInvoices: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.request(`/admin/invoices?${query}`);
    },
    getRevenueReport: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.request(`/admin/reports/revenue?${query}`);
    },
    getMerchantReport: () => api.request('/admin/reports/merchants'),
    getAuditLogs: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.request(`/admin/audit-logs?${query}`);
    },
  },
};
