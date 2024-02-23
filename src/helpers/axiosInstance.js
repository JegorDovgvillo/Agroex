import axios from 'axios';
import _ from 'lodash';

import getToken from '@helpers/getToken';

import { BASE_URL } from './endpoints';

function getCookie() {
  const cookies = _.map(document.cookie.split(';'), (cookie) =>
    cookie.split('=')
  );
  const cookie = _.find(cookies, ([name]) =>
    _.includes(name.trim(), 'idToken')
  );
  return cookie ? cookie[1] : null;
}

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
