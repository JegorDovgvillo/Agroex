export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

const ENDPOINTS = {
  IMAGES: '/images',
  LOTS: '/lots',
  LOTS_DETAILS: '/lots/details',
  USERS: '/users',
  CATEGORIES: '/categories',
  CATEGORIES_ALL: '/categories/all',
  COUNTRIES: '/countries',
  TAGS: '/tags',
  AUTH: '/auth/register/',
  UPDATE_DB: '/users/updatedb',
};

export default ENDPOINTS;
