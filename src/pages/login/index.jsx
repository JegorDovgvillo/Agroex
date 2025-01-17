import { useNavigate } from 'react-router-dom';
import { Hub } from 'aws-amplify/utils';
import { useEffect } from 'react';
import _ from 'lodash';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useDispatch } from 'react-redux';

import { createUser } from '@thunks/fetchUsers.js';
import { getUserFromCognito } from '@thunks/fetchUsers.js';

import LoginForm from '@components/loginForm';

import ROUTES from '@helpers/routeNames.js';

import timeZones from '../../data/timeZones.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    Hub.listen('auth', async (data) => {
      if (data?.payload?.event === 'signedIn') {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};

        dispatch(getUserFromCognito());
        dispatch(createUser(idToken.payload.sub));
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
