import { Amplify } from 'aws-amplify';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { CookieStorage } from 'aws-amplify/utils';
import { useEffect, useState } from 'react';
import { EventSource } from 'extended-eventsource';
import { fetchAuthSession } from 'aws-amplify/auth';

import Router from '@helpers/router';
import awsConfigUsers from '@helpers/cognito/aws-config-users';
import ENDPOINTS, { BASE_URL } from '@helpers/endpoints';

import store from '@store/store';

import { customTheme } from './theme';

function App() {
  const [sseConnection, setSseConnection] = useState(null);

  cognitoUserPoolsTokenProvider.setKeyValueStorage(
    new CookieStorage({ path: '/', secure: true, sameSite: 'strict' })
  );

  Amplify.configure(awsConfigUsers);

  useEffect(() => {
    openConnection().then((data) => setSseConnection(data));
  }, []);

  const openConnection = async () => {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    const sse = new EventSource(`${BASE_URL}${ENDPOINTS.SSE}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return sse;
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Provider store={store}>
        <Router sseConnection={sseConnection} />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
