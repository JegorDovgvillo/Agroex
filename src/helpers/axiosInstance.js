import axios from 'axios';

import { BASE_URL } from './endpoints';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    currency: 'USD',
  },
});

export default axiosInstance;
