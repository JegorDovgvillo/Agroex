import axios from 'axios';

import getCookie from '@helpers/getCookie';

import { BASE_URL } from './endpoints';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Определяем, нужно ли отправлять токен
    if (config.needAuthorization) {
      const cookie = await getCookie();
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
