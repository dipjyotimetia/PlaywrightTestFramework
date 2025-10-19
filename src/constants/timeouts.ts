/**
 * Timeout Constants
 * Centralized timeout management
 */

export const TIMEOUTS = {
  // General timeouts
  SHORT: 5000,        // 5 seconds
  MEDIUM: 15000,      // 15 seconds
  LONG: 30000,        // 30 seconds
  EXTRA_LONG: 60000,  // 60 seconds

  // Specific timeouts
  NAVIGATION: 30000,
  API_REQUEST: 30000,
  ELEMENT_VISIBLE: 10000,
  PAGE_LOAD: 30000,
  ANIMATION: 1000,
  DEBOUNCE: 500,
};

export default TIMEOUTS;
