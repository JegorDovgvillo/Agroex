export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;
export const MAP_URL = import.meta.env.VITE_MAP_URL;

const ENDPOINTS = {
  LOTS: '/lots',
  LOTS_DETAILS: '/lots/details',
  USERS: '/users',
  CATEGORIES: '/categories',
  CATEGORIES_ALL: '/categories/all',
  COUNTRIES: '/countries',
  TAGS: '/tags',
  AUTH: '/auth/register/',
  UPDATE_DB: '/users/updatedb',
  BETS: '/bets',
  SSE: '/sse/open-sse-stream',
  REPORTS: '/reports',
  MARK_AS_READ: 'sse/markRead',
};

export default ENDPOINTS;
