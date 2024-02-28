import { useNavigate } from 'react-router-dom';
import { Hub } from 'aws-amplify/utils';
import { useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { fetchAuthSession } from 'aws-amplify/auth';

import LoginForm from '@components/loginForm';

import ROUTES from '@helpers/routeNames.js';

import timeZones from '../../data/timeZones.js';
import axiosInstance from '@helpers/axiosInstance.js';
import { getCookie } from '@helpers/getCookie.js';

const Login = () => {
  const navigate = useNavigate();

  async function currentSession() {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      return idToken.payload;
    } catch (err) {}
  }

  useEffect(() => {
    Hub.listen('auth', async (data) => {
      if (data?.payload?.event === 'signedIn') {
        const response = await currentSession();
        // const cookie = await getCookie();
        const userData = {
          name: response.name,
          email: response.email,
          zoneinfo: response?.zoneinfo || 'Europe/London',
          sub: response.sub,
        };
        const axios = await axiosInstance();
        console.log(axios);
        const registerResponse = await axios.post(
          '/auth/register',
          userData
          // {
          //   headers: { Authorization: Bearer ${cookie} },
          // }
        );
        navigate(ROUTES.LOTS);
      }
    });
  }, []);

  const filteredTimeZone = _.filter(timeZones, { value: 'Europe/London' });

  return (
    <LoginForm filteredTimeZone={filteredTimeZone} timeZones={timeZones} />
  );
};

export default Login;
