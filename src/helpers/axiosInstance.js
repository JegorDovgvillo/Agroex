import axios from 'axios';

import { getCookie } from './getCookie';
import { BASE_URL } from './endpoints';

const axiosInstance = async () => {
  const cookie = await getCookie();

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${cookie}` },
  });
  return axiosInstance;
};
export default axiosInstance;
