import axios from 'axios';

import getToken from '@helpers/getToken';

import { BASE_URL } from './endpoints';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    currency: 'USD',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.method.toUpperCase() !== 'GET') {
      const cookie = await getToken();

      if (cookie) {
        config.headers.Authorization = `Bearer ${cookie}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
