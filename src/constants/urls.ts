/**
 * Application URLs
 * Centralized URL management
 */

export const URLS = {
  // Base URLs
  BASE_URL: process.env.BASE_URL || 'https://example.com',
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.example.com',

  // Auth URLs
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // App URLs
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Product URLs
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,

  // API Endpoints
  API: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    USERS: '/api/users',
    USER_BY_ID: (id: string | number) => `/api/users/${id}`,
    PRODUCTS: '/api/products',
    PRODUCT_BY_ID: (id: string | number) => `/api/products/${id}`,
  },
};

export default URLS;
