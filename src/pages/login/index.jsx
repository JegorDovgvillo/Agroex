import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signUp, confirmSignIn, fetchAuthSession } from '@aws-amplify/auth';
import {
  setAccessToken,
  setIdToken,
} from '../../store/slices/usersListSlice.js';

import LoginForm from '@components/loginForm';

import timeZones from '../../data/timeZones.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filteredTimeZone = timeZones.filter(
    (zone) => zone.value === 'Europe/London'
  );

  const getTokens = async () => {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    dispatch(setAccessToken(accessToken.toString()));
    dispatch(setIdToken(idToken.toString()));
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
      let { challengeResponse } = formData;
      const response = await confirmSignIn({
        challengeResponse,
      });

      response.isSignedIn(navigate('/lots'), getTokens());
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
