// API Service Layer for Django backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const DJANGO_MODE = import.meta.env.VITE_DJANGO_BACKEND === 'true';

// Helper to get CSRF token from cookies (Django requirement)
function getCsrfToken() {
  const name = 'csrftoken';
  let csrfToken = '';
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        csrfToken = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return csrfToken;
}

// Helper function for API calls with Django support
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add CSRF token for POST/PUT/DELETE requests if using Django
  if (DJANGO_MODE && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
    headers['X-CSRFToken'] = getCsrfToken();
  }

  // Add auth token if available
  const authToken = localStorage.getItem('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: DJANGO_MODE ? 'include' : 'omit', // Include cookies for Django session auth
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.detail || errorData.error || JSON.stringify(errorData) || `API Error: ${response.status}`;
      return { success: false, error: errorMessage, status: response.status };
    }

    const data = await response.json();
    
    // Handle Django's response format
    if (DJANGO_MODE && data.results !== undefined) {
      // Django REST Framework paginated response
      return { success: true, data: data.results, meta: { count: data.count, next: data.next, previous: data.previous } };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('API Call Error:', error);
    return { success: false, error: error.message };
  }
}

// Dashboard API calls
export const dashboardAPI = {
  getOverview: () => apiCall('/dashboard/overview/'),
  getSpendingBreakdown: () => apiCall('/dashboard/spending_breakdown/'),
  getSpendingTrend: () => apiCall('/dashboard/spending_trend/'),
  getRecentTransactions: (params = {}) => apiCall('/dashboard/recent_transactions/', {
    method: 'GET',
  }),
};

// Transactions API calls
export const transactionsAPI = {
  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiCall(`/transactions/${query ? `?${query}` : ''}`);
  },
  create: (transactionData) => apiCall('/transactions/', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  }),
  update: (id, transactionData) => apiCall(`/transactions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  }),
  delete: (id) => apiCall(`/transactions/${id}/`, { method: 'DELETE' }),
};

// Budgets API calls
export const budgetsAPI = {
  getAll: () => apiCall('/budgets/'),
  getById: (id) => apiCall(`/budgets/${id}/`),
  create: (budgetData) => apiCall('/budgets/', {
    method: 'POST',
    body: JSON.stringify(budgetData),
  }),
  update: (id, budgetData) => apiCall(`/budgets/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(budgetData),
  }),
  delete: (id) => apiCall(`/budgets/${id}/`, { method: 'DELETE' }),
  spending_vs_budget: () => apiCall('/budgets/spending_vs_budget/'),
};

// Expenses API calls
export const expensesAPI = {
  create: (expenseData) => apiCall('/expenses/', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  }),
  getCategories: () => apiCall('/expenses/categories/'),
};

// Reports API calls (using Dashboard endpoints for financial reports)
export const reportsAPI = {
  getOverview: () => dashboardAPI.getOverview(),
  getSpendingBreakdown: () => dashboardAPI.getSpendingBreakdown(),
  getSpendingTrend: () => dashboardAPI.getSpendingTrend(),
  getRecentTransactions: (limit = 10) => apiCall(`/dashboard/recent_transactions/?limit=${limit}`),
};

// Auth API calls (Django JWT or Session auth)
export const authAPI = {
  login: (credentials) => {
    // Support both { email, password } and positional arguments
    const payload = typeof credentials === 'object' 
      ? credentials 
      : { email: credentials, password: arguments[1] };
    
    return apiCall('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  register: (userData) => apiCall('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  logout: () => apiCall('/auth/logout/', { method: 'POST' }),
  // For Django JWT token refresh
  refreshToken: (refreshToken) => apiCall('/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken }),
  }),
};

export default apiCall;
