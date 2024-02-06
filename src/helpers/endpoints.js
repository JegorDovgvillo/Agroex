export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

const ENDPOINTS = {
  IMAGES: import.meta.env.VITE_IMAGES,
  LOTS: import.meta.env.VITE_LOTS_ENDPOINT,
  LOTS_DETAILS: import.meta.env.VITE_LOTS_DETAILS_ENDPOINT,
  USERS: import.meta.env.VITE_USERS,
  ALL_CATEGORIES: import.meta.env.VITE_ALL_CATEGORIES,
  MAIN_CATEGORIES: import.meta.env.VITE_MAIN_CATEGORIES,
  COUNTRIES: import.meta.env.VITE_COUNTRIES,
};

export default ENDPOINTS;
