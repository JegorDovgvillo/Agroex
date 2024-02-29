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
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
