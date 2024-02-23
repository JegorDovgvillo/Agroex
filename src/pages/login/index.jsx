import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignIn, fetchAuthSession } from '@aws-amplify/auth';
import _ from 'lodash';

import LoginForm from '@components/loginForm';

import ROUTES from '@helpers/routeNames.js';

import timeZones from '../../data/timeZones.js';

const Login = () => {
  const navigate = useNavigate();

  const filteredTimeZone = _.filter(timeZones, { value: 'Europe/London' });

  const getTokens = async () => {
    return (await fetchAuthSession().tokens) ?? {};
  };

  const services = {
    async handleSignUp(formData) {
      const { username, password, options } = formData;
      const email = options.userAttributes.email;

      return signUp({
        username,
        password,
        email,
        options,
        autoSignIn: {
          enabled: true,
        },
      });
    },

    async handleConfirmSignIn(formData) {
      const { challengeResponse } = formData;
      const response = await confirmSignIn({
        challengeResponse,
      });

      response.isSignedIn(navigate(ROUTES.LOTS), getTokens());
    },
  };
  return (
    <LoginForm
      services={services}
      filteredTimeZone={filteredTimeZone}
      timeZones={timeZones}
    />
  );
};

export default Login;
