import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

import { BASE_URL } from './endpoints';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.method.toUpperCase() !== 'GET') {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};

      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
