import axios from 'axios';

import { BASE_URL, IMAGE_URL } from './endpoints';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;

export const axiosInstanceImages = axios.create({
  imageURL: IMAGE_URL,
});
