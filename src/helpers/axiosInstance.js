import axios from 'axios';
import _ from 'lodash';

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

export default axiosInstance;
